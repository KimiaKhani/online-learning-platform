
from pydantic import BaseModel
from typing import ClassVar
from datetime import datetime, date
from typing import List
from typing import Optional


class StudentBase(BaseModel):
    fullname: str
    email: str
    password: str
    national_code : int
    birthdate: date
    description: str
    academy_id: int


class StudentDisplay(BaseModel):
    fullname: str
    email: str
    national_code : int
    birthdate: date
    description: str

    class Config:
        from_orm = True


class TeachertBase(BaseModel):
    fullname: str
    email: str
    password: str
    national_code: int
    birthdate: date
    description: str


class TeacherDisplay(BaseModel):
    fullname: str
    email: str
    national_code: int
    birthdate: date
    description: str

    class Config:
        from_orm = True


