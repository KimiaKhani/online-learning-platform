import random
from fastapi import Depends, APIRouter, status, Response
from DB.models import Student
from DB.database import sessionlocal
from authentication1.auth import oauth2
from schemas import StudentSignUpBase, StudentAuth, StudentLoginBase
from schemas import VerifyphoneBase
from functions.validation import *
from typing import Annotated
from authentication1.auth import get_current_active_Student
from DB.hash import Hash
from DB.database import rds
from authentication1 import auth



router = APIRouter(prefix='/student', tags=['student'])

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

@router.post('/signup')
async def student_sign_up(userbase: StudentSignUpBase,response: Response):

    student = sessionlocal.query(Student).filter(Student.phonenumber==userbase.phonenumber).first()
    if student is not None:
        response.status_code = status.HTTP_409_CONFLICT
        return {
            "message": "این شماره قبلا استفاده شده است. وارد شوید"
        }
    if not is_valid_phone(userbase.phonenumber):
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "message": "شماره همراه نا معتبر است"
        }


    rnd = random.randint(1000, 9999)
    rds.setex(userbase.phonenumber, 180, rnd)
    print(rnd)

    return {
        "ok": True,
        "verify_code": rnd,
        "message": "مرحله اول انجام شد. کد تایید را وارد کنید"
    }


@router.post('/verify')
async def student_sign_up(verifybase: VerifyphoneBase, response: Response):

    code = rds.get(verifybase.phonenumber)
    if code is None:
        response.status_code == status.HTTP_404_NOT_FOUND
        return {
            "message": "شماره یافت نشد. مجددا در خواست کد دهید."
        }
    if int(code) != int(verifybase.code):
        response.status_code == status.HTTP_404_NOT_FOUND
        rds.delete(verifybase.phonenumber)
        return {
            "message": "کد نا معتبر"
        }

    valid_pass = is_valid_password(verifybase.password)

    if not valid_pass['valid']:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "message": valid_pass['message']
        }

    student = Student(
        phonenumber=verifybase.phonenumber,
        password=Hash.bcrypt(verifybase.password),
        email="",
        firstname="",
        lastname="",
        nationalcode="",
        cardnumber="",
        birthdate=""
    )
    sessionlocal.add(student)
    sessionlocal.commit()
    sessionlocal.refresh(student)

    student = sessionlocal.query(Student).filter(Student.phonenumber == verifybase.phonenumber).first()

    access_token = auth.create_access_token(data={'sub': student.phonenumber})
    return {
        'access_token': access_token,
        'type_token': 'bearer',
        'userID': student.id,
        'phonenumber': student.phonenumber,
        "ok": True,
        "message": "کد وارد شده تایید شد. خوش آمدید"
    }



@router.post('/login')
async def student_login(userbase: StudentLoginBase, response: Response):


    student = sessionlocal.query(Student).filter(Student.phonenumber==userbase.phonenumber).first()

    if student is None:
        response.status_code = status.HTTP_200_OK
        return {
            "error": "شماره همراه نا معتبر است"
        }
    if not Hash.verify(student.password,userbase.password):
        response.status_code = status.HTTP_200_OK
        return {
            "error": "رمز عبور نا معتبر است"
        }

    access_token = oauth2.create_access_token(data={'sub': student.phonenumber})

    return {
        'access_token': access_token,
        'type_token': 'bearer',
        'userID': student.id,
        'phonenumber': student.phonenumber,
        "ok": True,
        "message": "این مرحله انجام شد. کد تایید را وارد کنید"

    }



