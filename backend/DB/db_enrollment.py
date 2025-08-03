from DB.models import Enrollment, Course
from sqlalchemy.orm import Session
from datetime import date
from fastapi import HTTPException, status
from DB.models import Enrollment, Course
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from DB.models import Payment, Enrollment
from datetime import date

def enroll_in_course(student_id: int, course_id: int, db: Session):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="دوره‌ای با این شناسه پیدا نشد"
        )

    exists = db.query(Enrollment).filter(
        Enrollment.student_id == student_id,
        Enrollment.course_id == course_id
    ).first()

    if exists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Student already enrolled in this course."
        )

    enrollment = Enrollment(
        student_id=student_id,
        course_id=course_id,
        date=date.today(),
        status="pending"
    )

    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)

    return enrollment



def get_enrollments_for_student(student_id: int, db: Session):
    enrollments = db.query(Enrollment).options(joinedload(Enrollment.course))\
        .filter(Enrollment.student_id == student_id).all()

    if not enrollments:
        raise HTTPException(status_code=404, detail="هیچ ثبت‌نامی پیدا نشد")

    return enrollments


def make_payment(enrollment_id: int, amount: float, db: Session):
    enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="ثبت‌نام مورد نظر پیدا نشد")

    if enrollment.status == "paid":
        raise HTTPException(status_code=400, detail="شهریه قبلاً پرداخت شده است")

    payment = Payment(
        enrollment_id=enrollment_id,
        date=date.today(),
        amount=amount
    )
    db.add(payment)

    enrollment.status = "paid"
    db.commit()
    db.refresh(payment)
    return payment

def delete_enrollment(db: Session, enrollment_id: int):
    enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    db.delete(enrollment)
    db.commit()
    return {"message": "Enrollment deleted successfully"}

def get_all_enrollments(db: Session):
    enrollments = db.query(Enrollment).all()
    result = []
    for e in enrollments:
        result.append({
            "id": e.id,
            "course": {
                "id": e.course.id,
                "title": e.course.language_title,
                "level": e.course.level.name if hasattr(e.course.level, "name") else e.course.level,
                "price": e.course.price
            },
            "student": {
                "id": e.student.id,
                "name": e.student.name if hasattr(e.student, "name") else "نام نامشخص"
            },
            "date": e.date,
            "status": e.status
        })
    return result
def get_payment(db: Session, payment_id: int):
    return db.query(Payment).filter(Payment.id == payment_id).first()


def get_all_payments(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Payment).offset(skip).limit(limit).all()


def delete_payment(db: Session, payment_id: int):
    db_payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if db_payment:
        db.delete(db_payment)
        db.commit()
    return db_payment


def get_enrollment(enrollment_id: int, db: Session):
    enrollment = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return enrollment