from fastapi import APIRouter, Depends,Response
from schemas import TeacherBase, TeacherDisplay, UserAuth, UpdaTeacherBase
from sqlalchemy.orm import Session
from DB.database import get_db
from DB import db_teacher
from DB.models import Teacher
from authentication import auth
from fastapi import  HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from DB.hash import Hash
from authentication.auth import create_access_token
from DB.database import sessionlocal
from schemas import TeacherLoginBase


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


