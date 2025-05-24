from fastapi import APIRouter, Depends
from schema import TeachertBase, TeacherDisplay, UserAuth, UpdaTeacherBase
from sqlalchemy.orm import Session
from backend.DB.database import get_db
from backend.DB import db_teacher
from authentication import auth

router = APIRouter(prefix='/teacher', tags=['teacher'])


@router.post('/create', response_model=TeacherDisplay)
def create_teacher(request: TeachertBase, db: Session = Depends(get_db),
                    admin: UserAuth = Depends(auth.get_current_admin)):
    return db_teacher.create_teacher(request, db, admin.id)


@router.put('/update_info', response_model=UpdaTeacherBase)
def edite_teacher(request: UpdaTeacherBase, db: Session = Depends(get_db),
                   teacher: UserAuth = Depends(auth.get_current_teacher)):
    return db_teacher.edite_teacher(request, db, teacher.id)



@router.get('/get_teacher/{username}', response_model=TeacherDisplay)
def get_teacher(username: str, include_languages: bool = False, db: Session = Depends(get_db)):
    return db_teacher.get_teacher_by_username(username, db)