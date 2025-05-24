from backend.DB.models import Student, Teacher, Admin
from backend.DB.db_student import duplicate_nationalcode
from schema import StudentBase, TeachertBase, UpdaTeacherBase
from sqlalchemy.orm import Session
from backend.DB.hash import Hash
from fastapi.exceptions import HTTPException
from fastapi import status


#creat teacher
def create_teacher(request: TeachertBase, db: Session, admin_id: int):
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    checked = duplicate_nationalcode(request.national_code, db)
    if checked == True and teacher.national_code != request.code:
            raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,
                                detail='This user already exists')
    

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
    return teacher




#get teacher
def get_teacher_by_username(username: str, db: Session):
    teacher = db.query(Teacher).filter(Teacher.username == username).first()
    if not teacher:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='Teacher not found!')

    return teacher



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