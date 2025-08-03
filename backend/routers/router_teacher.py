from fastapi import APIRouter, Depends,Response
from schemas import TeacherBase, TeacherDisplay, UserAuth, UpdaTeacherBase
from sqlalchemy.orm import Session
from DB.database import get_db
from DB import db_teacher
from DB.models import Teacher
from authentication1 import auth
from fastapi import  HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from DB.hash import Hash
from authentication1.auth import create_access_token,get_current_teacher
from DB.database import sessionlocal
from schemas import TeacherLoginBase,TeacherProfile,EnrolledStudent,ChangePassword
from DB.models import Course,Student,Enrollment
from functions.validation import *
from typing import Annotated




router = APIRouter(prefix='/teacher', tags=['teacher'])


@router.post('/create', response_model=TeacherDisplay)
def create_teacher(request: TeacherBase, db: Session = Depends(get_db)):
    return db_teacher.create_teacher(request, db)


@router.put('/update_info', response_model=UpdaTeacherBase)
def edite_teacher(request: UpdaTeacherBase, db: Session = Depends(get_db),
                   teacher: UserAuth = Depends(auth.get_current_teacher)):
    return db_teacher.edite_teacher(request, db, teacher.id)



@router.get('/get_teacher/{username}', response_model=TeacherDisplay)
def get_teacher(username: str, include_languages: bool = False, db: Session = Depends(get_db)):
    return db_teacher.get_teacher_by_username(username, db)


@router.post('/login')
async def teacher_login(userbase: TeacherLoginBase, response: Response):
    db = sessionlocal()
    try:
        # جستجوی معلم بر اساس شماره تلفن
        teacher = db.query(Teacher).filter(Teacher.phonenumber == userbase.phonenumber).first()

        if teacher is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"error": "شماره همراه نامعتبر است"}

        # مقایسه پسورد
        if not Hash.verify(teacher.password, userbase.password):
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"error": "رمز عبور نامعتبر است"}

        # ایجاد توکن برای معلم
        access_token = auth.create_access_token(data={'sub': teacher.username, 'role': 'teacher'})

        return {
            'access_token': access_token,
            'type_token': 'bearer',
            'userID': teacher.id,
            'phonenumber': teacher.phonenumber,
            "ok": True,
            "message": "ورود با موفقیت انجام شد"
        }

    except Exception as e:
        print(f"LOGIN ERROR: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    finally:
        db.close()


@router.get("/profile", response_model=TeacherProfile)
def get_teacher_profile(teacher: Teacher = Depends(get_current_teacher), db: Session = Depends(get_db)):
    db_teacher = db.query(Teacher).filter(Teacher.id == teacher.id).first()
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return db_teacher


@router.get("/my_courses")
def get_my_courses(teacher: Teacher = Depends(get_current_teacher), db: Session = Depends(get_db)):
    courses = db.query(Course).filter(Course.teacher_name == teacher.username).all()
    return courses


@router.get("/enrolled_students", response_model=list[EnrolledStudent])
def get_enrolled_students(teacher: Teacher = Depends(get_current_teacher), db: Session = Depends(get_db)):
    courses = db.query(Course).filter(Course.teacher_name == teacher.username).all()
    course_ids = [course.id for course in courses]

    enrollments = db.query(Enrollment).filter(Enrollment.course_id.in_(course_ids)).all()
    student_ids = list(set(enrollment.student_id for enrollment in enrollments))

    students = db.query(Student).filter(Student.id.in_(student_ids)).all()
    return students

@router.put("/change_password")
def change_password(
    request: ChangePassword,
    current_user: Annotated[Teacher, Depends(get_current_teacher)],
    db: Session = Depends(get_db)
):
    user = db.query(Teacher).filter(Teacher.id == current_user.id).first()

    if not Hash.verify(user.password, request.old_password):
        raise HTTPException(status_code=400, detail="رمز فعلی اشتباه است")

    if not is_valid_password(request.new_password)["valid"]:
        raise HTTPException(status_code=400, detail="رمز جدید معتبر نیست")

    user.password = Hash.bcrypt(request.new_password)
    db.commit()
    return {"message": "رمز عبور با موفقیت تغییر یافت"}