from DB.models import Language, TeachLanguage, Teacher, Admin
from schemas import LanguageBase, LanguageUpdateBase
from sqlalchemy.orm import Session, joinedload
from DB.hash import Hash
from fastapi.exceptions import HTTPException
from fastapi import status
from DB.models import Course, Language


#create language
def create_language(request: LanguageBase, db: Session , admin_id: int):
     
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    language = Language(
        title=request.title,
        description=request.description
    )

    db.add(language)
    db.commit()
    db.refresh(language)


    db.commit()

    return language

def get_language_statistics(db: Session):
    languages = db.query(Language).all()
    stats = []

    for lang in languages:
        courses = db.query(Course).filter(Course.language_title == lang.title).all()

        course_count = len(courses)
        available_count = len([c for c in courses if not c.is_completed])
        levels = list(set(c.level.value for c in courses))  # enum به string تبدیل می‌شه

        stats.append({
            "language": lang.title,
            "description": lang.description,
            "course_count": course_count,
            "available_count": available_count,
            "levels": levels
        })

    return stats


#edit language
def update_language(title: str, request: LanguageUpdateBase, db: Session, admin_id: int):
        
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

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

