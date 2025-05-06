from DB.models import Student
from schema import StudentBase
from sqlalchemy.orm import Session
from DB.hash import Hash
from fastapi.exceptions import HTTPException
from fastapi import status



def create_student(request: StudentBase, db: Session):
    #name = request.username

    student = Student(
        username=request.username,
        password=Hash.bcrypt(request.password),
        email=request.email,
        national_code=request.national_code,
        birthdate=request.birthdate
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


def get_student_by_username(username: str, db: Session):
    student = db.query(Student).filter(Student.username == username).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='User not found !')

    return student
