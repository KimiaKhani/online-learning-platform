from DB.models import Video, Enrollment
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session

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

    if not enrollment or not enrollment.payment_status:
        raise HTTPException(status_code=403, detail="برای مشاهده ویدیوها باید دوره را خریداری کرده باشید.")

    videos = db.query(Video).filter(Video.course_id == course_id).all()
    return videos
