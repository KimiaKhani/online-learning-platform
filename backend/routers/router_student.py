from fastapi import APIRouter, Depends
from schema import StudentDisplay, StudentBase
from sqlalchemy.orm import Session
from DB.database import get_db
from DB import db_student
from authentication import auth

router = APIRouter(prefix='/student', tags=['student'])


@router.post('/create', response_model=StudentDisplay)
def create_student(request: StudentBase, db: Session = Depends(get_db)):
    return db_student.create_student(request, db)


@router.get('/get_student/{username}', response_model=StudentDisplay)
def get_student(username: str, db: Session = Depends(get_db)):
    return db_student.get_student_by_username(username, db)

