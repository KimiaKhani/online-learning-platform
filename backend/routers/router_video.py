# router_video.py
from fastapi import APIRouter, File, UploadFile, Depends
from sqlalchemy.orm import Session
from DB.database import get_db
from authentication1 import auth
from schemas import VideoCreate, VideoDisplay
from DB.db_video import create_video, get_videos_by_course_id
import uuid
import boto3
from DB.models import Teacher, Student
from authentication1 import auth
from typing import Annotated


router = APIRouter(prefix="/videos", tags=["Videos"])

LIARA_ENDPOINT_URL="https://storage.c2.liara.space"
LIARA_ACCESS_KEY="b7s7kp8ahau53bdi"
LIARA_SECRET_KEY="1e0d830b-70ab-4e08-8da6-def65b6c76ca"
BUCKET_NAME="online-learning-platform"

s3 = boto3.client(
    "s3",
    endpoint_url=LIARA_ENDPOINT_URL,
    aws_access_key_id=LIARA_ACCESS_KEY,
    aws_secret_access_key=LIARA_SECRET_KEY
)

@router.post("/upload", response_model=VideoDisplay)
def upload_video(
    title: str,
    course_id: int,
    current_teacher: Teacher = Depends(auth.get_current_teacher),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    filename = f"{uuid.uuid4()}_{file.filename}"
    s3.upload_fileobj(file.file, BUCKET_NAME, filename, ExtraArgs={"ACL": "public-read"})
    url = f"{LIARA_ENDPOINT_URL}/{BUCKET_NAME}/{filename}"
    video_data = VideoCreate(
        title=title,
        url=url,
        course_id=course_id,
        uploaded_by=current_teacher.id
    )
    return create_video(video_data, db)



@router.get("/{course_id}", response_model=list[VideoDisplay])
def get_course_videos(
    course_id: int,
    db: Session = Depends(get_db),
    current_student: Student = Depends(auth.get_current_student)
):
    return get_videos_by_course_id(course_id, db, current_student.id)
