from fastapi import APIRouter, Depends
from schemas import StudentDisplay, StudentBase, UpdateStudentBase, UserAuth, AdminBase, StudentSignUpBase, StudentAuth, StudentLoginBase
from sqlalchemy.orm import Session
from DB.database import get_db
from DB import db_student
from authentication1 import auth
import logging
from fastapi.exceptions import HTTPException
import random
from fastapi import Depends, APIRouter, status, Response
from DB.models import Student,Course,Enrollment
from DB.database import sessionlocal
from schemas import VerifyphoneBase
from functions.validation import *
from typing import Annotated
from authentication1.auth import get_current_active_Student
from DB.hash import Hash
from DB.database import rds
from authentication1 import auth
from datetime import datetime
from fastapi.exceptions import HTTPException
from authentication1.auth import get_current_student
from schemas import ChangePassword
from DB.hash import Hash
from schemas import EnrollmentRequest
from schemas import EnrollmentDisplay,PaymentBase,CourseLinkDisplay
from DB import db_course


logging.basicConfig(level=logging.DEBUG)



router = APIRouter(prefix='/student', tags=['student'])


@router.post('/create', response_model=StudentDisplay)
def create_student(request: StudentBase, db: Session = Depends(get_db)):
    try:
        return db_student.create_student(request, db)
    except Exception as e:
        logging.error(f"Error creating student: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    


@router.put('/update_info', response_model=UpdateStudentBase)
def update_my_profile(
    request: UpdateStudentBase,
    current_user: Annotated[UserAuth, Depends(get_current_student)],
    db: Session = Depends(get_db)
):
    return db_student.edite_student(request, db, current_user.id)

@router.get('/get_student/{username}', response_model=StudentDisplay)
def get_student(username: str, db: Session = Depends(get_db)):
    return db_student.get_student_by_username(username, db)


@router.get("/me")
async def get_my_info(current_user: Annotated[StudentAuth, Depends(get_current_active_Student)]):
    return {
        "id": current_user.id,
        "phonenumber": current_user.phonenumber
    }


@router.get("/profile", response_model=StudentDisplay)
def get_my_profile(
    current_user: Annotated[Student, Depends(get_current_student)]
):
    return current_user




@router.put("/change_password")
def change_password(
    request: ChangePassword,
    current_user: Annotated[Student, Depends(get_current_student)],
    db: Session = Depends(get_db)
):
    user = db.query(Student).filter(Student.id == current_user.id).first()

    if not Hash.verify(user.password, request.old_password):
        raise HTTPException(status_code=400, detail="رمز فعلی اشتباه است")

    if not is_valid_password(request.new_password)["valid"]:
        raise HTTPException(status_code=400, detail="رمز جدید معتبر نیست")

    user.password = Hash.bcrypt(request.new_password)
    db.commit()
    return {"message": "رمز عبور با موفقیت تغییر یافت"}

@router.get("/isvalidstudent")
async def is_valid_student(response:Response,
                      current_student: Annotated[StudentAuth, Depends(get_current_active_Student)]):
    try:
        student = sessionlocal.query(Student).filter(Student.id == current_student.get('sub'))
        if not student:
            return False
        return True
    except:
        return False

# ------------------- Signup Step 1 -------------------
@router.post('/signup')
async def student_sign_up(userbase: StudentSignUpBase, response: Response):
    db = sessionlocal()
    try:
        student = db.query(Student).filter(Student.phonenumber == userbase.phonenumber).first()
        if student is not None:
            response.status_code = status.HTTP_409_CONFLICT
            return {"message": "این شماره قبلا استفاده شده است. وارد شوید"}

        if not is_valid_phone(userbase.phonenumber):
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"message": "شماره همراه نا معتبر است"}

        rnd = random.randint(1000, 9999)
        rds.setex(userbase.phonenumber, 180, rnd)

        return {
            "ok": True,
            "verify_code": rnd,
            "message": "مرحله اول انجام شد. کد تایید را وارد کنید"
        }

    except Exception as e:
        print(f"SIGNUP ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        db.close()

# ------------------- Signup Step 2: Verify -------------------
@router.post('/verify')
async def student_verify(verifybase: VerifyphoneBase, response: Response):
    db = sessionlocal()
    try:
        code = rds.get(verifybase.phonenumber)
        if code is None:
            response.status_code = status.HTTP_404_NOT_FOUND
            return {"message": "شماره یافت نشد. مجددا درخواست کد دهید."}

        stored_code = code.decode("utf-8")  

        if str(verifybase.code) != stored_code:  
            response.status_code = status.HTTP_400_BAD_REQUEST
            rds.delete(verifybase.phonenumber)
            return {"message": "کد نامعتبر است"}


        valid_pass = is_valid_password(verifybase.password)
        if not valid_pass['valid']:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"message": valid_pass['message']}

        new_student = Student(
            username=verifybase.phonenumber,
            phonenumber=verifybase.phonenumber,
            password=Hash.bcrypt(verifybase.password),
            email="default@email.com",
            national_code=0,
            birthdate=datetime.today()
        )

        db.add(new_student)
        db.commit()
        db.refresh(new_student)
        rds.delete(verifybase.phonenumber)

        access_token = auth.create_access_token(data={'sub': new_student.username, 'role': 'student'})

        return {
            'access_token': access_token,
            'type_token': 'bearer',
            'userID': new_student.id,
            'phonenumber': new_student.phonenumber,
            "ok": True,
            "message": "ثبت‌نام با موفقیت انجام شد"
        }

    except Exception as e:
        print(f"VERIFY ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        db.close()

# ------------------- Login -------------------
# @router.post('/login')
# async def student_login(userbase: StudentLoginBase, response: Response):
#     db = sessionlocal()
#     try:
#         student = db.query(Student).filter(Student.phonenumber == userbase.phonenumber).first()

#         if student is None:
#             response.status_code = status.HTTP_400_BAD_REQUEST
#             return {"error": "شماره همراه نامعتبر است"}

#         if not Hash.verify(student.password, userbase.password):
#             response.status_code = status.HTTP_400_BAD_REQUEST
#             return {"error": "رمز عبور نامعتبر است"}

#         access_token = auth.create_access_token(data={'sub': student.username, 'role': 'student'})

#         return {
#             'access_token': access_token,
#             'type_token': 'bearer',
#             'userID': student.id,
#             'phonenumber': student.phonenumber,
#             "ok": True,
#             "message": "ورود با موفقیت انجام شد"
#         }

#     except Exception as e:
#         print(f"LOGIN ERROR: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")
#     finally:
#         db.close()