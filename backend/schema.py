
from pydantic import BaseModel
from typing import ClassVar
from datetime import datetime, date
from typing import List
from typing import Optional


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


class TeacherDisplay(BaseModel):
    username: str
    email: str
    national_code: int
    birthdate: date
    description: str

    class Config:
        from_attributes = True


class UpdaTeacherBase(BaseModel):
    username: Optional[str]
    email: Optional[str]
    password: Optional[str]
    national_code: Optional[int]
    birthdate: Optional[date]
    description: Optional[str]


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
