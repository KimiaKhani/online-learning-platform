from fastapi import APIRouter, Depends
from schemas import LanguageBase, LanguageUpdateBase, UserAuth
from sqlalchemy.orm import Session
from DB.database import get_db
from DB import db_language
from authentication1 import auth

router = APIRouter(prefix='/language', tags=['language'])


@router.post('/create', response_model=LanguageBase)
def create_language(request: LanguageBase, db: Session = Depends(get_db)):
    return db_language.create_language(request, db)


@router.put('/update_info', response_model=LanguageUpdateBase)
def update_language(title : str, request: LanguageUpdateBase, db: Session = Depends(get_db)):
    return db_language.update_language(title, request, db)



@router.get('/get_language/{title}', response_model=LanguageBase)
def get_language(title: str, db: Session = Depends(get_db)):
    return db_language.get_language(title, db)


