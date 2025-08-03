from fastapi import APIRouter, Depends
from schemas import AdminBase
from sqlalchemy.orm import Session
from DB.database import get_db
from DB import db_admin
from authentication import auth
import logging
from fastapi.exceptions import HTTPException
from schemas import TeacherCreate, TeacherDisplay
from authentication1.auth import get_current_admin
from typing import Annotated
from DB.models import Admin,Teacher,Language
from DB import db_teacher
from DB import db_admin
from DB.hash import Hash
from fastapi import APIRouter ,HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from DB import db_admin
from authentication1.auth import create_access_token
from DB.hash import Hash


logging.basicConfig(level=logging.DEBUG)


router = APIRouter(prefix='/admin', tags=['admin'])


@router.post('/create', response_model=AdminBase)
def create_admin(request: AdminBase, db: Session = Depends(get_db)):
    try:
        return db_admin.create_admin(request, db)
    except Exception as e:
        logging.error(f"Error creating admin: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    


@router.get('/get_admin/{username}', response_model=AdminBase)
def get_admin(username: str, db: Session = Depends(get_db)):
    return db_admin.get_admin_by_username(username, db)

@router.post("/login")
def login_admin(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    admin = db_admin.get_admin_by_phonenumber(request.username, db)
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Admin not found")
    if not Hash.verify(request.password, admin.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    access_token = create_access_token(data={"sub": admin.phonenumber})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/create-teacher", response_model=TeacherDisplay)
def create_teacher_for_admin(
    request: TeacherCreate,
    current_admin: Annotated[Admin, Depends(get_current_admin)],
    db: Session = Depends(get_db)
):
    # بررسی که معلم قبلاً در سیستم نباشه
    existing_teacher = db.query(Teacher).filter(Teacher.phonenumber == request.phonenumber).first()
    if existing_teacher:
        raise HTTPException(status_code=400, detail="Teacher already exists")

    # ذخیره معلم جدید
    hashed_password = Hash.get_password_hash(request.password)  # هش کردن رمز
    teacher = Teacher(
        username=request.username,
        email=request.email,
        password=hashed_password,
        phonenumber=request.phonenumber,
        national_code=request.national_code,
        birthdate=request.birthdate,
    )

    db.add(teacher)
    db.commit()
    db.refresh(teacher)

    for lang_title in request.language_titles:
        lang = db.query(Language).filter(Language.title == lang_title).first()
        if not lang:
            raise HTTPException(status_code=404, detail=f"Language {lang_title} not found")
        teach_language = TeachLanguage(teacher_id=teacher.id, language_id=lang.id)
        db.add(teach_language)

    db.commit()
    return teacher



@router.post("/create-teacher", response_model=TeacherDisplay)
def create_teacher_for_admin(
    request: TeacherCreate,
    current_admin: Annotated[Admin, Depends(get_current_admin)],
    db: Session = Depends(get_db)
):
    return db_teacher.create_teacher_by_admin(request, db)
