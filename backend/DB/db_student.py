from backend.DB.models import Student, Admin
from schema import StudentBase, UpdateStudentBase
from sqlalchemy.orm import Session
from backend.DB.hash import Hash
from fastapi.exceptions import HTTPException
from fastapi import status


#creat new student
def create_student(request: StudentBase, db: Session):


    checked = duplicate_nationalcode(request.national_code, db)
    if checked == True:
            raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,
                                detail='This user already exists')
    
    student = Student(
        username=request.username,
        password=Hash.bcrypt(request.password),
        email=request.email,
        national_code=request.national_code,
        birthdate=request.birthdate
    )

   
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


#edite student
def edite_student(request: UpdateStudentBase, db: Session, student_id: int):
    user = db.query(Student).filter(Student.id == student_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    code = request.national_code
    checked = duplicate_nationalcode(code, db)
    if checked == True and Student.national_code != request.code:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE,
                            detail='This user already exists')


    user.username = request.username
    user.password = Hash.bcrypt(request.password)
    user.email = request.email
    user.national_code = request.national_code
    user.birthdate = request.birthdate

    db.commit()

    return user



#get student by username
def get_student_by_username(username: str, db: Session):
   
    student = db.query(Student).filter(Student.username == username).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='User not found !')

    return student

#get student by natioanl code
def get_student_by_NC(national_code: int, db: Session):
    student = db.query(Student).filter(Student.national_code == national_code).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='User not found !')

    return student



#chenck for duplicate natoinal code
def duplicate_nationalcode(code : int , db: Session):
    user = db.query(Student).filter(Student.national_code == code).first()
    return user is not None
    


#creat new admin
def create_admin(request: StudentBase, db: Session):

    admin = Admin(
        username=request.username,
        password=Hash.bcrypt(request.password),
        email=request.email
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


#get student by admin
def get_admin_by_username(username: str, db: Session):
    admin = db.query(Admin).filter(Admin.username == username).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='admin not found !')

    return admin

