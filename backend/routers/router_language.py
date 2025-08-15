from fastapi import APIRouter, Depends
from schemas import LanguageBase, LanguageUpdateBase, UserAuth
from sqlalchemy.orm import Session
from DB.database import get_db
from DB import db_language
from authentication1 import auth
from DB.db_language import get_language_statistics
from DB.models import Language

router = APIRouter(prefix='/language', tags=['language'])


@router.post('/create', response_model=LanguageBase)
def create_language(request: LanguageBase, db: Session = Depends(get_db), admin: UserAuth = Depends(auth.get_current_admin)):
    print("📥 زبان جدید در حال ثبت است...")

    return db_language.create_language(request, db, admin.id)

@router.get('/all')
def get_all_languages(db: Session = Depends(get_db)):
    return db.query(Language).all()


@router.put('/update_info', response_model=LanguageUpdateBase)
def update_language(title : str, request: LanguageUpdateBase, db: Session = Depends(get_db),  admin: UserAuth = Depends(auth.get_current_admin)):
    return db_language.update_language(title, request, db, admin.id)



@router.get('/get_language/{title}', response_model=LanguageBase)
def get_language(title: str, db: Session = Depends(get_db)):
    return db_language.get_language(title, db)


@router.get("/statistics")
def get_language_stats(db: Session = Depends(get_db)):
    return get_language_statistics(db)