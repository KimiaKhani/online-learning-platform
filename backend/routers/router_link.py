# routers/link.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from DB.database import get_db
from DB.models import Course, Teacher, Student, Enrollment

router = APIRouter(prefix="/course", tags=["course"])

@router.post("/course/{course_id}/add-meet-link")
def add_google_meet_link_router(course_id: int, meet_link: str, teacher_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    # ✅ تطبیق صحیح: username با teacher_name
    if course.teacher_name != teacher.username:
        raise HTTPException(status_code=403, detail="You are not authorized to add a Google Meet link for this course.")

    if not course.is_online:
        raise HTTPException(status_code=400, detail="This course is not online")

    course.link = meet_link
    db.commit()
    return {"message": "Google Meet link added successfully", "google_meet_link": meet_link}

@router.get("/course/{course_id}/meet-link")
def get_google_meet_link_for_students_router(course_id: int, student_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    # (اختیاری) اگر لازم است فقط برای دانشجویان paid برگردد، اینجا چک Enrollment بگذار
    return {"google_meet_link": course.link}

@router.delete("/course/{course_id}/remove-meet-link")
def remove_google_meet_link_router(course_id: int, teacher_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    teacher = db.query(Teacher).filter(Teacher.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    # ✅ همان تطبیق
    if course.teacher_name != teacher.username:
        raise HTTPException(status_code=403, detail="You are not authorized to remove the link for this course.")

    course.link = None
    db.commit()
    return {"message": "Link removed"}
