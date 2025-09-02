from fastapi import APIRouter, Depends
from schemas import CourseBase, CourseDisplay
from sqlalchemy.orm import Session
from DB.database import get_db
from DB import db_course
from authentication1 import auth
import logging
from DB.models import Course
from fastapi.exceptions import HTTPException
from DB.db_link import add_link, get_link_for_students, remove_link_by_teacher
from typing import List, Optional


logging.basicConfig(level=logging.DEBUG)



router = APIRouter(prefix='/course', tags=['course'])


@router.post("/course/{course_id}/add-meet-link")
def add_google_meet_link_router(course_id: int, meet_link: str, teacher_id: int, db: Session = Depends(get_db)):
    return add_link(course_id, meet_link, teacher_id, db)



@router.get("/course/{course_id}/meet-link")
def get_google_meet_link_for_students_router(course_id: int, student_id: int, db: Session = Depends(get_db)):
    return get_link_for_students(course_id, student_id, db)



@router.delete("/course/{course_id}/remove-meet-link")
def remove_google_meet_link_router(course_id: int, teacher_id: int, db: Session = Depends(get_db)):
    return remove_link_by_teacher(course_id, teacher_id, db)
