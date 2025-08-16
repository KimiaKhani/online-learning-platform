# routers/enrollments.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List, Annotated
from DB.database import get_db
from DB.models import Student, Course, Enrollment, Payment
from authentication1.auth import get_current_student
from authentication1.auth import get_current_admin

from schemas import EnrollmentRequest, EnrollmentDisplay, CourseLinkDisplay, PaymentBase
from datetime import date
from schemas import EnrollmentAdminRow
router = APIRouter(prefix="/enrollments", tags=["Enrollments"])

# 1) ثبت‌نام در دوره
@router.post("", response_model=EnrollmentDisplay, status_code=201)
def enroll_course(
    request: EnrollmentRequest,
    current_user: Annotated[Student, Depends(get_current_student)],
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == request.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    exists = db.query(Enrollment).filter(
        Enrollment.student_id == current_user.id,
        Enrollment.course_id == request.course_id
    ).first()
    if exists:
        raise HTTPException(status_code=409, detail="Already enrolled")

    enr = Enrollment(
        student_id=current_user.id,
        course_id=request.course_id,
        date=date.today(),   # ✅ اضافه کن
        status="pending"
    )
    db.add(enr)
    db.commit()
    db.refresh(enr)
    return enr

# 2) لیست ثبت‌نام‌های من (بدون تداخل مسیر)
@router.get("/me", response_model=List[EnrollmentDisplay])
def my_enrollments(
    current_user: Annotated[Student, Depends(get_current_student)],
    db: Session = Depends(get_db)
):
    rows = (
        db.query(Enrollment)
          .options(joinedload(Enrollment.course))
          .filter(Enrollment.student_id == current_user.id)
          .all()
    )
    return rows

# 3) جزئیات یک ثبت‌نام (id مشخص)
@router.get("/{enrollment_id:int}", response_model=EnrollmentDisplay)
def get_enrollment_route(enrollment_id: int, db: Session = Depends(get_db)):
    enr = (
        db.query(Enrollment)
          .options(joinedload(Enrollment.course))
          .filter(Enrollment.id == enrollment_id).first()
    )
    if not enr:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    return enr

# 4) حذف ثبت‌نام
@router.delete("/{enrollment_id:int}", status_code=204)
def delete_enrollment_route(enrollment_id: int, db: Session = Depends(get_db)):
    enr = db.query(Enrollment).filter(Enrollment.id == enrollment_id).first()
    if not enr:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    db.delete(enr)
    db.commit()
    return

# 5) لینک‌های من (فقط دوره‌های paid)
@router.get("/me/links", response_model=List[CourseLinkDisplay])
def get_my_links(
    current_user: Annotated[Student, Depends(get_current_student)],
    db: Session = Depends(get_db)
):
    courses = (
        db.query(Course)
          .join(Enrollment, Enrollment.course_id == Course.id)
          .filter(Enrollment.student_id == current_user.id,
                  Enrollment.status == "paid")
          .all()
    )
    return courses

# ===== پرداخت‌ها را از مسیرهای تداخل‌دار جدا کن =====

# 6) پرداخت یک ثبت‌نام
@router.post("/{enrollment_id:int}/pay")
def pay_for_course(
    enrollment_id: int,
    request: PaymentBase,
    current_user: Annotated[Student, Depends(get_current_student)],
    db: Session = Depends(get_db)
):
    enr = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id,
        Enrollment.student_id == current_user.id
    ).first()
    if not enr:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    if enr.status == "paid":
        raise HTTPException(status_code=400, detail="Already paid")

    p = Payment(
        enrollment_id=enrollment_id,
        amount=request.amount,
        date=date.today()    # ✅ اضافه کن
    )   
    db.add(p)
    enr.status = "paid"
    db.commit()
    db.refresh(p)
    return {"payment_id": p.id, "status": "ok"}

# 7) لیست پرداخت‌های من
@router.get("/payments")
def get_my_payments(
    current_user: Annotated[Student, Depends(get_current_student)],
    db: Session = Depends(get_db),
    skip: int = 0, limit: int = 20
):
    q = (
        db.query(Payment)
          .join(Enrollment, Payment.enrollment_id == Enrollment.id)
          .filter(Enrollment.student_id == current_user.id)
          .offset(skip).limit(limit)
          .all()
    )
    return q

# 8) جزئیات/حذف پرداخت
@router.get("/payments/{payment_id:int}")
def get_payment_route(payment_id: int, db: Session = Depends(get_db)):
    p = db.query(Payment).filter(Payment.id == payment_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Payment not found")
    return p

@router.delete("/payments/{payment_id:int}", status_code=204)
def delete_payment_route(payment_id: int, db: Session = Depends(get_db)):
    p = db.query(Payment).filter(Payment.id == payment_id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Payment not found")
    db.delete(p)
    db.commit()
    return

@router.get("/by-course/{course_id:int}", response_model=List[EnrollmentAdminRow])
def get_enrollments_by_course_for_admin(
    course_id: int,
    admin = Depends(get_current_admin),   # فقط ادمین
    db: Session = Depends(get_db)
):
    rows = (
        db.query(Enrollment)
          .options(joinedload(Enrollment.student))
          .filter(Enrollment.course_id == course_id)
          .all()
    )
    # خروجی را به شکل دلخواه بسازیم (status/date/student)
    out = []
    for e in rows:
        out.append({
            "id": e.id,
            "date": e.date,
            "status": e.status,
            "student": e.student,   # Pydantic با from_attributes سریالایز می‌کند
        })
    return out