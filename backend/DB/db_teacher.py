from DB.models import Student, Teacher, Admin, TeachLanguage, Language
from DB.db_student import duplicate_nationalcode
from schema import StudentBase, TeachertBase, UpdaTeacherBase, TeacherDisplay
from sqlalchemy.orm import Session
from DB.hash import Hash
from fastapi.exceptions import HTTPException
from fastapi import status


#creat teacher
def create_teacher(request: TeachertBase, db: Session):
    languages = []
    
    for title in request.language_titles:
        language = db.query(Language).filter(Language.title == title).first()
        if not language:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Language {title} not found in the database")
        languages.append(language)
    
    checked = duplicate_nationalcode(request.national_code, db)
    if checked:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,
                             detail="This national code is already in use")
    
    teacher = Teacher(
        username=request.username,
        password=Hash.bcrypt(request.password),
        email=request.email,
        national_code=request.national_code,
        birthdate=request.birthdate,
        description=request.description
    )
    
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    
    for language in languages:
        teach_language = TeachLanguage(
            teacher_id=teacher.id,
            language_id=language.id
        )
        db.add(teach_language)
    
    db.commit()

    language_titles = [language.title for language in languages]

    return TeacherDisplay(
        username=teacher.username,
        email=teacher.email,
        national_code=teacher.national_code,
        birthdate=teacher.birthdate,
        description=teacher.description,
        language_titles=language_titles 
    )




#get teacher
def get_teacher_by_username(username: str, db: Session):
    teacher = db.query(Teacher).filter(Teacher.username == username).first()
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='Teacher not found!')
    
    language_titles = [language.title for language in teacher.languages]
    
    return TeacherDisplay(
        username=teacher.username,
        email=teacher.email,
        national_code=teacher.national_code,
        birthdate=teacher.birthdate,
        description=teacher.description,
        language_titles=language_titles  
    )


#edite teacher
def edite_teacher(request: UpdaTeacherBase, db: Session, teacher_id: int):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    code = request.national_code
    checked = duplicate_nationalcode(code, db)
    if checked == True and teacher.national_code != request.code:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,
                            detail='This user already exists')

    teacher.username = request.username
    teacher.password = Hash.bcrypt(request.password)
    teacher.email = request.email
    teacher.national_code = request.national_code
    teacher.birthdate = request.birthdate

    db.commit()

    return teacher