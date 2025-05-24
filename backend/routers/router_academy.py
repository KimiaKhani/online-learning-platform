from fastapi import APIRouter, Depends
from schema import AcademyBase, UserAuth
from sqlalchemy.orm import Session
from backend.DB.database import get_db
from backend.DB import db_academy
from authentication import auth
import logging
from fastapi.exceptions import HTTPException


logging.basicConfig(level=logging.DEBUG)



router = APIRouter(prefix='/academy', tags=['academy'])


@router.post('/create', response_model=AcademyBase)
def create_academy(request: AcademyBase, db: Session = Depends(get_db),
                    user: UserAuth = Depends(auth.get_current_admin)):
    try:
        return db_academy.create_Academy(request, db, user.id)
    except Exception as e:
        logging.error(f"Error creating academy: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    


@router.put('/update_info', response_model=AcademyBase)
def edite_academy(id : int, request: AcademyBase, db: Session = Depends(get_db),
                user: UserAuth = Depends(auth.get_current_admin)):
    return db_academy.edite_academy(id, request, db, user.id)
