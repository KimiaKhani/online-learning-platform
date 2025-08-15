
from pydantic import BaseModel
from typing import ClassVar
from datetime import datetime, date
from typing import List
from typing import Optional
from enum import Enum
from enum import Enum as PyEnum
from sqlalchemy import Enum as SQLEnum
from pydantic import BaseModel
from typing import Optional
class StudentBase(BaseModel):
    username: str
    password: str
    email: str
    phonenumber:str
    national_code : int
    birthdate: date
    academy_id: Optional[int]


class StudentDisplay(BaseModel):
    username: Optional[str]
    email: Optional[str]
    national_code: Optional[int]
    birthdate: Optional[date]
    phonenumber: Optional[str]

    class Config:
        from_orm = True

class EnrolledStudent(BaseModel):
    id: int
    username: str
    email: str
    phonenumber: str
    national_code: int
    birthdate: date

    class Config:
        from_attributes = True



class EnrollmentBase(BaseModel):
    course_id: int

class EnrollmentRequest(BaseModel):
    course_id: int


# schemas.py
class CourseLinkDisplay(BaseModel):
    id: int
    language_title: str
    teacher_name: str          # 👈 اضافه
    level: str                 # 👈 اضافه
    price: float               # 👈 اختیاری ولی مفید
    link: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True
        use_enum_values = True  # برای enum سطح

class EnrollmentDisplay(BaseModel):
    id: int
    course_id: int
    date: date                # ✅ اجباری
    status: str
    course: Optional[CourseLinkDisplay] = None
    class Config:
        from_attributes = True


class UpdateStudentBase(BaseModel):
    username: Optional[str] = None
    phonenumber: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    national_code: Optional[int] = None
    birthdate: Optional[date] = None



class VerifyphoneBase(BaseModel):
    phonenumber: str
    password:str
    code: str

class StudentSignUpBase(BaseModel):
    phonenumber: str

class StudentAuth(BaseModel):
    id : int
    phonenumber : str

class StudentLoginBase(BaseModel):
    phonenumber: str
    password: str
class ChangePassword(BaseModel):
    old_password: str
    new_password: str


class UserAuth(BaseModel):
    id: int
    phonenumber: str
    password: str

    class Config:
        from_attributes = True

class TeacherLoginBase(BaseModel):
    phonenumber: str
    password: str
class TeacherAuth(BaseModel):
    id : int
    phonenumber : str



class TeacherBase(BaseModel):
    username: str
    password: str
    email: str
    phonenumber:str
    national_code : int
    birthdate: date
    description: str | None = None  # این می‌تواند None باشد
    language_titles: List[str]  # زبان‌های تدریس‌شده  

class LanguageOut(BaseModel):
    id: int
    title: str
    description: Optional[str]

    class Config:
        from_attributes = True

class TeacherProfile(BaseModel):
    id: int
    username: str
    email: str
    phonenumber: str
    national_code: int
    birthdate: date
    description: Optional[str]
    languages: List[LanguageOut]

    class Config:
        from_attributes = True

class TeacherDisplay(BaseModel):
    id: int
    username: str
    email: str
    phonenumber: str
    national_code: str
    birthdate: date
    description: Optional[str]
    language_titles: Optional[List[str]] = None 

    class Config:
        from_attributes = True

class TeacherCreate(BaseModel):
    username: str
    email: str
    password: str
    phonenumber: str
    national_code: str
    birthdate: date
    language_titles: List[str]  


class UpdaTeacherBase(BaseModel):
    username: Optional[str] = None
    phonenumber: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    national_code: Optional[int] = None
    birthdate: Optional[date] = None
    description: Optional[str] = None
    language_titles: Optional[List[str]] = None 



class AdminBase(BaseModel):
    username: Optional[str]
    phonenumber:Optional[str]
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
    link: Optional[str] = None

    class Config:
        from_attributes = True
        use_enum_values = True
        orm_mode = True   # ✅ حتماً اینو بذار




class EnrollmentBase(BaseModel):
    course_id : int
    student_id : int
    date : datetime
    statuse : str



class PaymentBase(BaseModel):
    enrollment_id: int
    amount: float




class VideoCreate(BaseModel):
    title: str
    url: str
    course_id: int
    uploaded_by: int

class VideoDisplay(VideoCreate):
    id: int

    class Config:
        from_attributes = True
