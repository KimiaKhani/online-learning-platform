from fastapi import Depends, status, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from jose.exceptions import JWTError
from DB.database import get_db
from DB.db_student import get_student_by_username
from DB.db_admin import get_admin_by_username
from DB.db_teacher import get_teacher_by_username
from typing import Optional, Annotated
from schemas import StudentAuth


oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/authentication/token')

SECRET_KEY = '862211892BE38C036BC0C43EEF0939953C989B4B2384D9DB77D1E1A516F04980'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    error_credential = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='invalid authorization',
        headers={'WWW-Authenticate': 'Bearer'}
    )
    try:
        _dict = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = _dict.get('sub')
        if not username:
            raise error_credential
    except JWTError:
        raise error_credential

    user = get_admin_by_username(username, db)
    if not user:
        raise error_credential
    return user


def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    error_credential = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='invalid authorization',
        headers={'WWW-Authenticate': 'Bearer'}
    )
    try:
        _dict = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = _dict.get('sub')
        if not username:
            raise error_credential
    except JWTError:
        raise error_credential

    admin = get_admin_by_username(username, db)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='admin not found !'
        )
    return admin


def get_current_teacher(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    error_credential = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='invalid authorization',
        headers={'WWW-Authenticate': 'Bearer'}
    )
    try:
        _dict = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = _dict.get('sub')
        if not username:
            raise error_credential
    except JWTError:
        raise error_credential

    teacher = get_teacher_by_username(username, db)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='teacher not found !'
        )
    return teacher

#  Student
def get_current_student(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    error_credential = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='invalid authorization',
        headers={'WWW-Authenticate': 'Bearer'}
    )
    try:
        _dict = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = _dict.get('sub')
        if not username:
            raise error_credential
    except JWTError:
        raise error_credential

    student = get_student_by_username(username, db)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='student not found !'
        )
    return student

async def get_current_active_Student(
    current_user: Annotated[StudentAuth, Depends(get_current_student)]
):

    return current_user



# # In your authentication.py
# # In authentication.py
# def create_access_token_for_teacher(teacher: Teacher):
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
#     to_encode = {"sub": teacher.username}  # Using username as identifier
#     return create_access_token(to_encode, expires_delta=access_token_expires)

