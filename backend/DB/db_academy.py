from DB.models import Academy, Student, Teacher, Admin
from sqlalchemy.orm import Session
from DB.hash import Hash
from fastapi.exceptions import HTTPException
from fastapi import status
from schemas import AcademyBase


#creat Academy
def create_Academy(request: AcademyBase, db: Session, admin_id: int):

    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    academy = Academy(
       name = request.name,
       office_phone_number = request.office_phone_number,
       mobile_phone_number = request.mobile_phone_number,
       email = request.email,
       address = request.address,
       social_media = request.social_media
    )

    db.add(academy)
    db.commit()
    db.refresh(academy)
    return academy


#edite Academy
def edite_academy(id: int, request: AcademyBase, db: Session, admin_id: int):
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized access")

    academy = db.query(Academy).filter(Academy.id == id).first()

    if not academy:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Academy not found")

    academy.name = request.name
    academy.office_phone_number = request.office_phone_number
    academy.mobile_phone_number = request.mobile_phone_number
    academy.email = request.email
    academy.address = request.address
    academy.social_media = request.social_media

    db.commit()

    return academy

