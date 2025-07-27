
from pydantic import BaseModel
from typing import ClassVar
from datetime import datetime, date
from typing import List
from typing import Optional
from enum import Enum
from enum import Enum as PyEnum
from sqlalchemy import Enum as SQLEnum




class StudentBase(BaseModel):
    username: str
    email: str
    password: str
    national_code : int
    birthdate: date
    academy_id: int


class StudentDisplay(BaseModel):
    username: str
    email: str
    national_code : int
    birthdate: date

    class Config:
        from_orm = True

class UpdateStudentBase(BaseModel):
    username: Optional[str]
    email: Optional[str]
    password: Optional[str]
    national_code: Optional[int]
    birthdate: Optional[date]



class UserAuth(BaseModel):
    id: int
    username: str
    password: str

    class Config:
        from_attributes = True



class TeachertBase(BaseModel):
    username: str
    email: str
    password: str
    national_code: int
    birthdate: date
    description: str
    language_titles: List[str] 


class TeacherDisplay(BaseModel):
    username: str
    email: str
    national_code: int
    birthdate: date
    description: str
    language_titles: List[str] 

    class Config:
        from_attributes = True


class UpdaTeacherBase(BaseModel):
    username: Optional[str]
    email: Optional[str]
    password: Optional[str]
    national_code: Optional[int]
    birthdate: Optional[date]
    description: Optional[str]
    language_titles: Optional[List[str]] 



class AdminBase(BaseModel):
    username: Optional[str]
    email: Optional[str]
    password: Optional[str]


class AcademyBase(BaseModel):
    name : str
    office_phone_number : int
    mobile_phone_number : int
    email  : str
    address  : str
    social_media : str



class LanguageBase(BaseModel):
    title : str
    description : str
    teacher_names: Optional[List[str]] = None

    class Config:
        from_attributes = True



class LanguageUpdateBase(BaseModel):
    title: Optional[str]   
    description: Optional[str]  
    teacher_names: Optional[List[str]] = None

    class Config:
        from_attributes = True



class LevelEnum(PyEnum):
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"
    C2 = "C2"


class CourseBase(BaseModel):
    language_title: str
    teacher_name: str
    is_online: bool
    level: LevelEnum  
    start_time : datetime
    end_time : datetime
    is_completed : bool
    price : float

    class Config:
        use_enum_values = True 
        from_attributes = True

class CourseDisplay(BaseModel):
    id: int
    language_title: str
    teacher_name: str
    is_online: bool
    level: str
    start_time: datetime
    end_time: datetime
    is_completed: bool
    price : float


    class Config:
        from_attributes = True
        use_enum_values = True



class EnrollmentBase(BaseModel):
    course_id : int
    student_id : int
    date : datetime
    statuse : str


class PaymentBase(BaseModel):
    course_id : int
    student_id : int
    date : datetime
    statuse : str
    amount : float
