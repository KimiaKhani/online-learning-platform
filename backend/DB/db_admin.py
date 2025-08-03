from DB.models import Admin
from schemas import AdminBase
from sqlalchemy.orm import Session
from DB.hash import Hash
from fastapi.exceptions import HTTPException
from fastapi import status
import boto3
import os
from dotenv import load_dotenv

load_dotenv()

LIARA_ENDPOINT = os.getenv("LIARA_ENDPOINT_URL")
LIARA_ACCESS_KEY = os.getenv("LIARA_ACCESS_KEY")
LIARA_SECRET_KEY = os.getenv("LIARA_SECRET_KEY")
LIARA_BUCKET_NAME = os.getenv("BUCKET_NAME")

s3 = boto3.client(
    "s3",
    endpoint_url=LIARA_ENDPOINT,
    aws_access_key_id=LIARA_ACCESS_KEY,
    aws_secret_access_key=LIARA_SECRET_KEY,
)

#creat new admin
def create_admin(request: AdminBase, db: Session):

    admin = Admin(
        username=request.username,
        phonenumber=request.phonenumber,
        password=Hash.bcrypt(request.password),
        email=request.email
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


#get student by admin
def get_admin_by_username(username: str, db: Session):
    admin = db.query(Admin).filter(Admin.username == username).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail='admin not found !')

    return admin

def get_admin_by_phonenumber(phonenumber: str, db: Session):
    admin = db.query(Admin).filter(Admin.phonenumber == phonenumber).first()
    if not admin:
        raise HTTPException(status_code=404, detail="User not found!")
    return admin