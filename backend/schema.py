
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



class StudentAuth(BaseModel):
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
        from_orm = True


