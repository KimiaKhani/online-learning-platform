from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, status
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from DB.database import get_db
from DB.db_student import get_student_by_username
from DB.db_teacher import get_teacher_by_username
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt
from jose.exceptions import JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')

SECRET_KEY = 'c1d8066fc811213b43896dd944b811713234da0c1f1f002b3a9dfcc740112cf1'
ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    error_credential = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                     detail='invalid authorization',
                                     headers={'WWW-authenticate': 'bearer'}
                                     )

    try:
        _dict = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = _dict.get('sub')

        if not username:
            raise error_credential

        # Token expiration check
        if 'exp' in _dict and datetime.utcnow() > datetime.utcfromtimestamp(_dict['exp']):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Could not validate credentials',
            headers={'WWW-authenticate': 'bearer'}
        )

    role = _dict.get('role')
    if role == 'student':
        user = get_student_by_username(username, db)
        if user is None:
            raise error_credential
    elif role == 'teacher':
        user = get_teacher_by_username(username, db)
        if user is None:
            raise error_credential
    else:
        raise error_credential

    return user


def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    error_credential = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                     detail='invalid authorization',
                                     headers={'WWW-authenticate': 'bearer'}
                                     )

    try:
        _dict = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = _dict.get('sub')

        if not username:
            raise error_credential

        # Token expiration check
        if 'exp' in _dict and datetime.utcnow() > datetime.utcfromtimestamp(_dict['exp']):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Could not validate credentials',
            headers={'WWW-authenticate': 'bearer'}
        )

    role = _dict.get('role')
    if role == 'student':
        user = get_student_by_username(username, db)
        if user is None:
            raise error_credential
    elif role == 'teacher':
        user = get_teacher_by_username(username, db)
        if user is None:
            raise error_credential
    else:
        raise error_credential

    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Protected'
        )

    return user
