from fastapi import APIRouter, Depends
from schemas import StudentDisplay, StudentBase, UpdateStudentBase, UserAuth, AdminBase, StudentSignUpBase, StudentAuth, StudentLoginBase
from sqlalchemy.orm import Session
from DB.database import get_db
from DB import db_student
from authentication1 import auth
import logging
from fastapi.exceptions import HTTPException
import random
from fastapi import Depends, APIRouter, status, Response
from DB.models import Student,Course,Enrollment
from DB.database import sessionlocal
from schemas import VerifyphoneBase
from functions.validation import *
from typing import Annotated
from authentication1.auth import get_current_active_Student,get_current_student
from DB.hash import Hash
from DB.database import rds
from authentication1 import auth
from datetime import datetime
from fastapi.exceptions import HTTPException
from schemas import ChangePassword
from DB.hash import Hash
from DB import db_enrollment
from schemas import EnrollmentRequest
from DB import db_enrollment
from schemas import EnrollmentDisplay,PaymentBase,CourseLinkDisplay
from DB import db_course
from DB.db_enrollment import  get_enrollment, delete_enrollment, get_all_enrollments , get_payment, get_all_payments, delete_payment


router = APIRouter(prefix="/enrollments", tags=["Enrollments"])



@router.post("/enroll")
def enroll_course(
    request: EnrollmentRequest,
    current_user: Annotated[Student, Depends(get_current_student)],
    db: Session = Depends(get_db)
):
    return db_enrollment.enroll_in_course(
        student_id=current_user.id,
        course_id=request.course_id,
        db=db
    )


@router.get("/{enrollment_id}")
def get_enrollment_route(enrollment_id: int, db: Session = Depends(get_db)):
    db_enrollment = get_enrollment(db, enrollment_id)
    if not db_enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return db_enrollment


@router.get("/{enrollment_id}", response_model=list[EnrollmentDisplay])
def my_enrollments(
    current_user: Annotated[Student, Depends(get_current_student)],
    db: Session = Depends(get_db)
):
    enrollments = db_enrollment.get_enrollments_for_student(current_user.id, db)

    results = []
    for e in enrollments:
        results.append(EnrollmentDisplay(
            course_id=e.course_id,
            date=e.date,
            status=e.status,
            course_title=e.course.language_title if e.course else None
        ))
    return results

@router.delete("/{enrollment_id}")
def delete_enrollment_route(enrollment_id: int, db: Session = Depends(get_db)):
    db_enrollment = delete_enrollment(db, enrollment_id)
    if not db_enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return {"message": "Enrollment deleted successfully"}


@router.get("/")
def get_all_enrollments_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_all_enrollments(db, skip, limit)



@router.get("/my-links", response_model=list[CourseLinkDisplay])
def get_my_links(current_user: Student = Depends(get_current_student), db: Session = Depends(get_db)):
    courses = db.query(Course).join(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.status == "paid"
    ).all()

    return courses


@router.post("/pay")
def pay_for_course(
    request: PaymentBase,
    current_user: Annotated[Student, Depends(get_current_student)],
    db: Session = Depends(get_db)
):
    return db_enrollment.make_payment(request.enrollment_id, request.amount, db)

@router.get("/{payment_id}")
def get_payment_route(payment_id: int, db: Session = Depends(get_db)):
    db_payment = get_payment(db, payment_id)
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return db_payment

@router.get("/")
def get_all_payments_route(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_all_payments(db, skip, limit)


@router.delete("/{payment_id}")
def delete_payment_route(payment_id: int, db: Session = Depends(get_db)):
    db_payment = delete_payment(db, payment_id)
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return {"message": "Payment deleted successfully"}
