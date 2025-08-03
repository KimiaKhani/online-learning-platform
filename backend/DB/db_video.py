from DB.models import Video
from sqlalchemy.orm import Session

def create_video(request, db: Session):
    video = Video(**request.dict())
    db.add(video)
    db.commit()
    db.refresh(video)
    return video

def get_videos_by_course_id(course_id: int, db: Session):
    return db.query(Video).filter(Video.course_id == course_id).all()
