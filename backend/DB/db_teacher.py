from DB.models import Student, Teacher
from schema import StudentBase, TeachertBase
from sqlalchemy.orm import Session
from DB.hash import Hash
from fastapi.exceptions import HTTPException
from fastapi import status



def create_teacher(request: TeachertBase, db: Session):
    #name = request.username

    teacher = Teacher(
        username=request.username,
        password=Hash.bcrypt(request.password),
        email=request.email,
        national_code=request.national_code,
        birthdate=request.birthdate,
        description=request.description
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher


def get_teacher_by_username(username: str, db: Session):
    teacher = db.query(Teacher).filter(Teacher.username == username).first()
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='User not found !')

    return teacher
