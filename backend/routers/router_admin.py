from fastapi import APIRouter, Depends
from schema import AdminBase
from sqlalchemy.orm import Session
from DB.database import get_db
from DB import db_student
from authentication import auth
import logging
from fastapi.exceptions import HTTPException


logging.basicConfig(level=logging.DEBUG)



router = APIRouter(prefix='/admin', tags=['admin'])




@router.post('/create', response_model=AdminBase)
def create_admin(request: AdminBase, db: Session = Depends(get_db)):
    try:
        return db_student.create_admin(request, db)
    except Exception as e:
        logging.error(f"Error creating admin: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    


@router.get('/get_admin/{username}', response_model=AdminBase)
def get_admin(username: str, db: Session = Depends(get_db)):
    return db_student.get_admin_by_username(username, db)