from fastapi import APIRouter, Depends
from schema import StudentDisplay, StudentBase, UpdateStudentBase, UserAuth, AdminBase
from sqlalchemy.orm import Session
from DB.database import get_db
from DB import db_student
from authentication import auth
import logging
from fastapi.exceptions import HTTPException


logging.basicConfig(level=logging.DEBUG)



router = APIRouter(prefix='/student', tags=['student'])


@router.post('/create', response_model=StudentDisplay)
def create_student(request: StudentBase, db: Session = Depends(get_db)):
    try:
        return db_student.create_student(request, db)
    except Exception as e:
        logging.error(f"Error creating student: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    


@router.put('/update_info', response_model=UpdateStudentBase)
def edite_student(request: UpdateStudentBase, db: Session = Depends(get_db),
                user: UserAuth = Depends(auth.get_current_student)):
    return db_student.edite_student(request, db, user.id)


@router.get('/get_student/{username}', response_model=StudentDisplay)
def get_student(username: str, db: Session = Depends(get_db)):
    return db_student.get_student_by_username(username, db)


