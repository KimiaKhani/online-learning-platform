from DB.models import Video, Enrollment
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
# db_video.py
from DB.models import Video, Enrollment
from fastapi import HTTPException, status
def create_video(request, db: Session):
    video = Video(**request.dict())
    db.add(video)
    db.commit()
    db.refresh(video)
    return video



def get_videos_by_course_id(course_id: int, student_id: int, db: Session):
    enrollment = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.student_id == student_id
    ).first()

    # فقط وقتی دانشجو "paid" شده باشد اجازه‌ی دیدن ویدیو دارد
    if not enrollment or enrollment.status != "paid":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="برای مشاهده ویدیوها باید دوره را خریداری کرده باشید.")

    return db.query(Video).filter(Video.course_id == course_id).all()
