import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Buycourse = () => {
  const { id } = useParams(); // course_id
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // فقط student می‌تواند ثبت‌نام کند

  useEffect(() => {
    if (!token) {
      alert('برای خرید باید وارد شوید.');
      window.dispatchEvent(new Event('open-auth-modal'));
      navigate(`/class/${id}`, { replace: true });
      return;
    }
    if (role !== 'student') {
      alert('فقط دانشجو می‌تواند ثبت‌نام کند.');
      navigate(`/class/${id}`, { replace: true });
      return;
    }
    axios
      .get(`http://localhost:8000/course/${id}`)
      .then((res) => setCourse(res.data))
      .catch(() => alert('خطا در دریافت اطلاعات دوره'));
  }, [id, token, role, navigate]);

  const enroll = async () => {
    try {
      // مرحله 1: ثبت‌نام
      const { data: enr } = await axios.post(
        'http://localhost:8000/enrollments',
        { course_id: Number(id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // مرحله 2: پرداخت خودکار
      await axios.post(
        `http://localhost:8000/enrollments/${enr.id}/pay`,
        { enrollment_id: enr.id, amount: course.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      

      alert('ثبت‌نام و پرداخت با موفقیت انجام شد ✅');
      navigate('/userpanel'); // مثلا هدایت به پنل کاربر
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) alert("⛔ کاربر با این شناسه یافت نشد.");
        else if (err.response.status === 403) alert("⛔ شما مجوز حذف این کاربر را ندارید.");
        else if (err.response.status === 409) alert("⛔ شما قبلا این دوره را ثبت نام کردید.");

        else alert("⛔ خطای سرور: " + (err.response.data?.detail || "نامشخص"));
      }
    }
  };

  if (!token || role !== 'student') return null;
  if (!course) return <div className="container py-5">در حال بارگذاری…</div>;

  return (
    <>
      <Header />
      <div className="container py-5" style={{ direction: 'rtl' }}>
        <h3>ثبت‌نام در {course.language_title} ({course.level})</h3>
        <p>مدرس: {course.teacher_name}</p>
        <p>قیمت: {course.price}</p>
        <button className="btn btn-success" onClick={enroll}>
          ثبت‌نام نهایی + پرداخت
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Buycourse;
