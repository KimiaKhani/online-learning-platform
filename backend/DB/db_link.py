from DB.models import Course, LevelEnum, Enrollment
from schemas import CourseBase
from sqlalchemy.orm import Session
from DB.hash import Hash
from DB.database import get_db
from fastapi.exceptions import HTTPException
from fastapi import status
from fastapi import BackgroundTasks
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from DB import models


def add_link(course_id: int, meet_link: str, teacher_id: str, db: Session):
    course = db.query(Course).filter(Course.id == course_id).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if course.teacher_name != teacher_id:
        raise HTTPException(status_code=403, detail="You are not authorized to add a Google Meet link for this course.")
    
    if course.is_online:
        course.link = meet_link
        db.commit()
        return {"message": "Google Meet link added successfully", "google_meet_link": meet_link}
    else:
        raise HTTPException(status_code=400, detail="This course is not online")



def get_link_for_students(course_id: int, student_id: int, db: Session):
    enrollment = db.query(Enrollment).filter(Enrollment.course_id == course_id, Enrollment.student_id == student_id).first()
    
    if not enrollment or not enrollment.payment_status:
        raise HTTPException(status_code=403, detail="You must purchase the course to join the meeting.")
    
    course = db.query(Course).filter(Course.id == course_id).first()
    
    if not course or not course.google_meet_link:
        raise HTTPException(status_code=404, detail="Google Meet link not available for this course.")
    
    return {"google_meet_link": course.google_meet_link}


def remove_link_by_teacher(course_id: int, teacher_id: str, db: Session):
    course = db.query(Course).filter(Course.id == course_id).first()
    
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    if course.teacher_name != teacher_id:
        raise HTTPException(status_code=403, detail="You are not authorized to remove the Google Meet link for this course.")
    
    course.google_meet_link = None
    db.commit()
    return {"message": "Google Meet link removed successfully"}

