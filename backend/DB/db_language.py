from DB.models import Language, TeachLanguage, Teacher, Admin
from schema import LanguageBase, LanguageUpdateBase
from sqlalchemy.orm import Session, joinedload
from DB.hash import Hash
from fastapi.exceptions import HTTPException
from fastapi import status



#create language
def create_language(request: LanguageBase, db: Session ):
     
    # admin = db.query(Admin).filter(Admin.id == admin_id).first()
    # if not admin:
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    language = Language(
        title=request.title,
        description=request.description
    )

    db.add(language)
    db.commit()
    db.refresh(language)


    db.commit()

    return language




#edit language
def update_language(title: str, request: LanguageUpdateBase, db: Session):
    language = db.query(Language).filter(Language.title == title).first()

    if not language:
        raise HTTPException(status_code=404, detail="Language not found")

    if request.title:
        language.title = request.title

    if request.description:
        language.description = request.description



    db.commit()
    db.refresh(language)

    return language




#get language
from sqlalchemy.orm import joinedload

def get_language(title: str, db: Session):
    language = db.query(Language).options(joinedload(Language.teachers)).filter(Language.title == title).first()
    
    if not language:
        raise HTTPException(status_code=404, detail="Language not found")

    teachers = [teacher.username for teacher in language.teachers]
    
    return LanguageBase(title=language.title, description=language.description, teacher_names=teachers)

