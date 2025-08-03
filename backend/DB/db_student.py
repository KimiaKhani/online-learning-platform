from DB.models import Student, Admin
from schemas import StudentBase, UpdateStudentBase
from sqlalchemy.orm import Session
from DB.hash import Hash
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
        phonenumber=request.phonenumber,
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
        raise HTTPException(status_code=404, detail="User not found")

    if request.username is not None:
        user.username = request.username

    if request.password is not None:
        user.password = Hash.bcrypt(request.password)

    if request.email is not None:
        user.email = request.email

    if request.phonenumber is not None:
        user.phonenumber = request.phonenumber

    if request.national_code is not None:
        checked = duplicate_nationalcode(request.national_code, db)
        if checked and request.national_code != user.national_code:
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail='This national code is already in use'
            )
        user.national_code = request.national_code

    if request.birthdate is not None:
        user.birthdate = request.birthdate

    db.commit()
    db.refresh(user)
    return user




def get_student_by_username(username: str, db: Session):
    student = db.query(Student).filter(Student.username == username).first()
    if not student:
        raise HTTPException(status_code=404, detail='User not found !')
    return student



#get all student
# def get_student_by_username(username: str, db: Session):
   
#     student = db.query(Student).filter(Student).all()
#     if not student:
#         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
#                             detail='User not found !')

#     return student

#get student by natioanl code
def get_student_by_NC(national_code: int, db: Session):
    student = db.query(Student).filter(Student.national_code == national_code).first()
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='User not found !')

    return student

def get_student_by_phone(phonenumber: str, db: Session):
    student = db.query(Student).filter(Student.phonenumber == phonenumber).first()
    if not student:
        raise HTTPException(status_code=404, detail="User not found!")
    return student


#chenck for duplicate natoinal code
def duplicate_nationalcode(code : int , db: Session):
    user = db.query(Student).filter(Student.national_code == code).first()
    return user is not None
    




