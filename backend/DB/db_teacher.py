from DB.models import Student, Teacher, Admin, TeachLanguage, Language
from DB.db_student import duplicate_nationalcode
from schemas import StudentBase, UpdaTeacherBase, TeacherDisplay , TeacherCreate
from sqlalchemy.orm import Session
from DB.hash import Hash
from fastapi.exceptions import HTTPException
from fastapi import status
from DB.models import Teacher, Language, TeachLanguage
from DB.hash import Hash
from fastapi import HTTPException, status
import logging



#creat teacher
def create_teacher(request: TeacherCreate, db: Session, admin_id:int):
    print("📥 Create teacher called")  # دیباگ سریع

    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    existing_teacher = db.query(Teacher).filter(Teacher.username == request.username).first()
    if existing_teacher:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                             detail="Username already taken")
    
    existing_teacher_by_email = db.query(Teacher).filter(Teacher.email == request.email).first()
    if existing_teacher_by_email:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already in use")

    existing_teacher_by_phone = db.query(Teacher).filter(Teacher.phonenumber == request.phonenumber).first()
    if existing_teacher_by_phone:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone number already in use")

    teacher = Teacher(
        username=request.username,
        email=request.email,
        password=Hash.bcrypt(request.password),
        phonenumber=request.phonenumber,
        national_code=request.national_code,
        birthdate=request.birthdate,
        description=request.description
    )

    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    
    languages = []
    for title in request.language_titles:
        language = db.query(Language).filter(Language.title == title).first()
        if not language:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Language {title} not found")
        languages.append(language)
    
    for language in languages:
        existing_relation = db.query(TeachLanguage).filter(
            TeachLanguage.teacher_id == teacher.id,
            TeachLanguage.language_id == language.id
        ).first()
        
        if not existing_relation:
            teach_language = TeachLanguage(teacher_id=teacher.id, language_id=language.id)
            db.add(teach_language)
        else:
            logging.warning(f"Teacher {teacher.username} already teaches {language.title}")
    
    db.commit()
    return TeacherDisplay(
        id=teacher.id,
        username=teacher.username,
        email=teacher.email,
        phonenumber=teacher.phonenumber,
        national_code=str(teacher.national_code),
        birthdate=teacher.birthdate,
        description=teacher.description,
        language_titles=[language.title for language in languages]
    )

#get all teacher
def get_all_teachers(db: Session):
    teachers = db.query(Teacher).all()
    result = []

    for teacher in teachers:
        # گرفتن زبان‌هایی که این استاد تدریس می‌کند
        languages = db.query(Language).join(TeachLanguage).filter(TeachLanguage.teacher_id == teacher.id).all()
        language_titles = [lang.title for lang in languages]

        result.append(TeacherDisplay(
            id=teacher.id,
            username=teacher.username,
            email=teacher.email,
            phonenumber=teacher.phonenumber,
            national_code=str(teacher.national_code),
            birthdate=teacher.birthdate,
            description=teacher.description,
            language_titles=language_titles
        ))

    return result
#get teacher
def get_teacher_by_username(username: str, db: Session):
    teacher = db.query(Teacher).filter(Teacher.username == username).first()
    if not teacher:
        raise HTTPException(status_code=404, detail='User not found !')
    return teacher


#edite teacher
def edite_teacher(request: UpdaTeacherBase, db: Session, teacher_id: int):
    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()

    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    # بررسی رمز عبور جدید (در صورت ارسال رمز عبور جدید)
    if request.password:
        teacher.password = Hash.bcrypt(request.password)  # هش کردن رمز عبور جدید

    if request.username:
        teacher.username = request.username
    if request.email:
        teacher.email = request.email
    if request.phonenumber:
        teacher.phonenumber = request.phonenumber
    if request.national_code:
        teacher.national_code = request.national_code
    if request.birthdate:
        teacher.birthdate = request.birthdate
    if request.description:
        teacher.description = request.description

    db.commit()
    db.refresh(teacher)

    return TeacherDisplay(
        id=teacher.id,
        username=teacher.username,
        email=teacher.email,
        phonenumber=teacher.phonenumber,
        national_code=str(teacher.national_code),
        birthdate=teacher.birthdate,
        description=teacher.description
    )




def create_teacher_by_admin(request: TeacherCreate, db: Session):
    existing = db.query(Teacher).filter(Teacher.national_code == request.national_code).first()
    if existing:
        raise HTTPException(status_code=409, detail="معلم با این کد ملی قبلاً ثبت شده است")

    teacher = Teacher(
        username=request.username,
        email=request.email,
        password=Hash.bcrypt(request.password),
        phonenumber=request.phonenumber,
        national_code=request.national_code,
        birthdate=request.birthdate,
    )

    db.add(teacher)
    db.commit()
    db.refresh(teacher)

    for lang_title in request.language_titles:
        lang = db.query(Language).filter(Language.title == lang_title).first()
        if not lang:
            raise HTTPException(status_code=404, detail=f"زبان '{lang_title}' پیدا نشد")

        relation = TeachLanguage(teacher_id=teacher.id, language_id=lang.id)
        db.add(relation)

    db.commit()
    return TeacherDisplay(
        id=teacher.id,
        username=teacher.username,
        email=teacher.email,
        phonenumber=teacher.phonenumber,
        national_code=teacher.national_code,
        birthdate=teacher.birthdate,
        description=teacher.description,
        language_titles=[
            lang.title for lang in db.query(Language)
            .join(TeachLanguage)
            .filter(TeachLanguage.teacher_id == teacher.id)
            .all()
        ]
    )



def get_teacher_by_phone(phonenumber: str, db: Session):
    teacher = db.query(Teacher).filter(Teacher.phonenumber == phonenumber).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="User not found!")
    return teacher