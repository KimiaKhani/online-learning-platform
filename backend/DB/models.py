from DB.database import Base
from sqlalchemy import Column, Integer,Float,String, DateTime, ForeignKey, Boolean, Date
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
from sqlalchemy import Enum as SQLEnum
from datetime import datetime




class Student(Base):
    __tablename__ = 'student'
    id = Column(Integer, index=True, primary_key=True)
    username = Column(String)
    password = Column(String)
    email = Column(String)
    phonenumber= Column(String)
    national_code = Column(Integer)
    birthdate = Column(Date)
    academy_id = Column(Integer, ForeignKey('academy.id'))
    academy = relationship("Academy", back_populates="students")
    enrollments = relationship("Enrollment", back_populates="student")




class Teacher(Base):
    __tablename__ = 'teacher'
    id = Column(Integer, index=True, primary_key=True)
    username = Column(String, unique=True)
    password = Column(String)
    email = Column(String)
    phonenumber= Column(String)
    national_code = Column(Integer)
    birthdate = Column(Date)
    description = Column(String)
    courses = relationship("Course", back_populates="teacher")
    teach_languages = relationship("TeachLanguage", back_populates="teacher", overlaps="languages")
    languages = relationship("Language", secondary="teach_languages", back_populates="teachers", overlaps="teach_languages")



class Admin(Base):
    __tablename__ = "admin"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    phonenumber= Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)




class Academy(Base):
    __tablename__ = 'academy'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    office_phone_number = Column(Integer)
    mobile_phone_number = Column(Integer)
    email = Column(String)
    address = Column(String)
    social_media = Column(String)
    students = relationship("Student", back_populates="academy")



class Language(Base):
    __tablename__ = 'languages'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    description = Column(String)
    teach_languages = relationship("TeachLanguage", back_populates="language", overlaps="teachers")
    teachers = relationship("Teacher", secondary="teach_languages", back_populates="languages", overlaps="teach_languages")
    courses = relationship("Course", back_populates="language")



class TeachLanguage(Base):
    __tablename__ = 'teach_languages'
    teacher_id = Column(Integer, ForeignKey('teacher.id'), primary_key=True)
    language_id = Column(Integer, ForeignKey('languages.id'), primary_key=True)
    teacher = relationship("Teacher", back_populates="teach_languages", overlaps="languages")
    language = relationship("Language", back_populates="teach_languages", overlaps="teachers")





class LevelEnum(PyEnum):
    A1 = "A1"
    A2 = "A2"
    B1 = "B1"
    B2 = "B2"
    C1 = "C1"
    C2 = "C2"

class Course(Base):
    __tablename__ = 'courses'
    id = Column(Integer, primary_key=True, index=True)
    teacher_name = Column(String, ForeignKey('teacher.username'))
    language_title = Column(String, ForeignKey('languages.title'))
    is_online = Column(Boolean)
    level = Column(SQLEnum(LevelEnum, name="levelenum", create_constraint=True), nullable=False)
    start_time = Column(DateTime, default=datetime.utcnow)  
    end_time = Column(DateTime)  
    is_completed = Column(Boolean, default=False)  
    price = Column(Float)
    link = Column(String, nullable=True) 
    teacher = relationship("Teacher", back_populates="courses")
    language = relationship("Language", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")
 #   schedules = relationship("Schedule", back_populates="course")




class Enrollment(Base):
    __tablename__ = 'enrollment'
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey('courses.id'))
    student_id = Column(Integer, ForeignKey('student.id'))
    date = Column(Date)
    status = Column(String)
    course = relationship("Course", back_populates="enrollments")
    student = relationship("Student", back_populates="enrollments")
    payment = relationship("Payment", back_populates="enrollment")




class Payment(Base):
    __tablename__ = 'payment'
    id = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey('enrollment.id'))
    date = Column(Date)
    amount = Column(Float)
    enrollment = relationship("Enrollment", back_populates="payment")


# class Schedule(Base):
#     __tablename__ = 'schedule'
#     course_id = Column(Integer, ForeignKey('courses.id'), primary_key=True)
#     course_day = Column(String)
#     course_time = Column(String)
#     course = relationship("Course", back_populates="schedules")



