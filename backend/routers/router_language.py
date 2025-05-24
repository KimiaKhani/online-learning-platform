from fastapi import APIRouter, Depends
from schema import LanguageBase, LanguageUpdateBase, UserAuth
from sqlalchemy.orm import Session
from backend.DB.database import get_db
from backend.DB import db_language
from authentication import auth

router = APIRouter(prefix='/language', tags=['language'])


@router.post('/create', response_model=LanguageBase)
def create_language(request: LanguageBase, db: Session = Depends(get_db),
                    admin: UserAuth = Depends(auth.get_current_admin)):
    return db_language.create_language(request, db, admin.id)


@router.put('/update_info', response_model=LanguageUpdateBase)
def update_language(title : str, request: LanguageUpdateBase, db: Session = Depends(get_db),
                   admin: UserAuth = Depends(auth.get_current_admin)):
    return db_language.update_language(title, request, db, admin.id)



@router.get('/get_language/{title}', response_model=LanguageBase)
def get_language(title: str, db: Session = Depends(get_db)):
    return db_language.get_language(title, db)


