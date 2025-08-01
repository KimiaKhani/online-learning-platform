from DB.models import Admin
from schemas import AdminBase
from sqlalchemy.orm import Session
from DB.hash import Hash
from fastapi.exceptions import HTTPException
from fastapi import status


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