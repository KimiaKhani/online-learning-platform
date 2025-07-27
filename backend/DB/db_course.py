from DB.models import Course, LevelEnum
from schema import CourseBase
from sqlalchemy.orm import Session
from DB.hash import Hash
from DB.database import get_db
from fastapi.exceptions import HTTPException
from fastapi import status
from fastapi import BackgroundTasks
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from DB import models
import pytz


# create new course
def create_course(request: CourseBase, db: Session):
    # admin = db.query(Admin).filter(Admin.id == admin_id).first()
    # if not admin:
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    course = Course(
        language_title=request.language_title,
        teacher_name=request.teacher_name,
        is_online=request.is_online,
        level=request.level,
        start_time=request.start_time,
        end_time=request.end_time, 
        is_completed=request.is_completed,
        price=request.price
    )

    db.add(course)
    db.commit()

    update_course_completion_status(db)  

    db.refresh(course)
    return course


# edite course
def edite_course(id: int, request: CourseBase, db: Session):
    # admin = db.query(Admin).filter(Admin.id == admin_id).first()
    # if not admin:
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    course = db.query(Course).filter(Course.id == id).first()
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="course not found")

    course.language_title = request.language_title
    course.teacher_name = request.teacher_name
    course.is_online = request.is_online 
    course.level = request.level
    course.start_time = request.start_time
    course.end_time = request.end_time
    course.is_completed = request.is_completed
    course.price = request.price

    db.commit()

    return course


#delete course
def delete_course( id : int, db: Session):
    # admin = db.query(Admin).filter(Admin.id == admin_id).first()
    # if not admin:
    #     raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    course = db.query(Course).filter(Course.id == id).first()

    try:
        db.delete(course)
        db.commit()
        return 'course Deleted'
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


def update_course_completion_status(db: Session):
    iran_timezone = pytz.timezone('Asia/Tehran')

    current_time_iran = datetime.now(iran_timezone)

    # دریافت دوره‌هایی که زمان پایان آنها گذشته و هنوز کامل نشده‌اند
    courses = db.query(models.Course).filter(models.Course.end_time < current_time_iran, models.Course.is_completed == False).all()
    
    for course in courses:
        course.is_completed = True
        db.commit()


scheduler = BackgroundScheduler()


#get course by language
def get_courses_by_language(language_title: str, db: Session):
    courses = db.query(Course).filter(Course.language_title == language_title).all()
    
    if not courses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No courses found for language '{language_title}'"
        )
    
    return courses

#get course by teacher
def get_courses_by_teacher(teacher_name: str, db: Session):
    courses = db.query(Course).filter(Course.teacher_name == teacher_name).all()
    
    if not courses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No courses found for teacher '{teacher_name}'"
        )
    
    return courses


#get course by level 
def get_courses_by_level(level: str, db: Session):
    try:
        level_enum = LevelEnum[level]
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid level '{level}'. Choose from: A1, A2, B1, B2, C1, C2."
        )

    courses = db.query(Course).filter(Course.level == level_enum).all()
    
    if not courses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No courses found for level '{level}'"
        )
    
    return courses



#get actice courses
def get_active_courses(db: Session):
    courses = db.query(Course).filter(Course.is_completed == False).all()
    
    if not courses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active (incomplete) courses found."
        )
    
    return courses



#combination of filters
def filter_courses(
    db: Session,
    language_title: str = None,
    teacher_name: str = None,
    level: str = None,
    is_completed: bool = None,
):
    from DB.models import Course, LevelEnum

    query = db.query(Course)

    if language_title:
        query = query.filter(Course.language_title == language_title)

    if teacher_name:
        query = query.filter(Course.teacher_name == teacher_name)

    if level:
        try:
            level_enum = LevelEnum[level.upper()]
            query = query.filter(Course.level == level_enum)
        except KeyError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid level '{level}'. Choose from: A1, A2, B1, B2, C1, C2."
            )

    if is_completed is not None:
        query = query.filter(Course.is_completed == is_completed)

    courses = query.all()

    if not courses:
        raise HTTPException(status_code=404, detail="No courses found with these filters.")

    return courses
