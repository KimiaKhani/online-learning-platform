from fastapi import APIRouter, Depends
from schema import TeachertBase, TeacherDisplay
from sqlalchemy.orm import Session
from DB.database import get_db
from DB import db_teacher
from authentication import auth

router = APIRouter(prefix='/teacher', tags=['teacher'])


@router.post('/create', response_model=TeacherDisplay)
def create_teacher(request: TeachertBase, db: Session = Depends(get_db)):
    return db_teacher.create_teacher(request, db)


@router.get('/get_teacher/{username}', response_model=TeacherDisplay)
def get_teacher(username: str, db: Session = Depends(get_db)):
    return db_teacher.get_teacher_by_username(username, db)

