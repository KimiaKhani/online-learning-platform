from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from DB.database import get_db
from DB.hash import Hash
from DB.db_student import get_student_by_username
from DB.db_teacher import get_teacher_by_username
from DB.db_admin import get_admin_by_username
from DB import models
from authentication1 import auth


router = APIRouter(prefix="/authentication", tags=["Authentication"])


from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from DB.database import get_db
from DB.hash import Hash
from DB.db_student import get_student_by_username
from DB.db_teacher import get_teacher_by_username
from DB.db_admin import get_admin_by_username
from DB import models
from authentication1 import auth


router = APIRouter(prefix="/authentication", tags=["Authentication"])



@router.post("/token")
def get_token(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    username = request.username
    password = request.password

    # Admin check
    admin = db.query(models.Admin).filter(models.Admin.username == username).first()
    if admin and Hash.verify(admin.password, password):
        access_token = auth.create_access_token(data={"sub": admin.username})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "userID": admin.id,
            "username": admin.username,
            "role": "admin"
        }

    # Teacher check
    teacher = db.query(models.Teacher).filter(models.Teacher.username == username).first()
    if teacher and Hash.verify(teacher.password, password):
        access_token = auth.create_access_token(data={"sub": teacher.username})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "userID": teacher.id,
            "username": teacher.username,
            "role": "teacher"
        }

    # Student check
    student = db.query(models.Student).filter(models.Student.username == username).first()
    if student and Hash.verify(student.password, password):
        access_token = auth.create_access_token(data={"sub": student.username})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "userID": student.id,
            "username": student.username,
            "role": "student"
        }

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="نام کاربری یا رمز اشتباه است",
        headers={"WWW-Authenticate": "Bearer"},
    ) 