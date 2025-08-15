import React, { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import "./instructor.css";
import "./course.css";
import image from "./ChatGPT Image Jul 28, 2025, 12_34_49 AM.png";
import { Link, useNavigate, useParams } from 'react-router-dom'; // ✅ درستش اینه
import axios from 'axios';


const Class = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleBuy = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('برای ثبت‌نام باید ابتدا وارد شوید.');
      // اگر می‌خوای مودال لاگین هدر باز شود:
      window.dispatchEvent(new Event('open-auth-modal'));
      return;
    }
    // فقط course id رو ببر. اطلاعات کاربر از توکن خونده می‌شه
    navigate(`/buy/${id}`, {
      state: {
        // اختیاری: برای تجربه بهتر UI، چند تا فیلد نمایشی ببر
        coursePreview: {
          language_title: course?.language_title,
          level: course?.level,
          price: course?.price,
        }
      }
    });
  };

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    if (!id) return; // اگر مسیر درست نبود
    setLoading(true);
    setErrMsg('');
    axios
      .get(`http://localhost:8000/course/${id}`)
      .then((res) => {
        setCourse(res.data);
      })
      .catch((err) => {
        console.error("خطا در گرفتن اطلاعات کلاس:", err);
        setErrMsg('خطا در دریافت اطلاعات کلاس');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="container py-5" style={{ direction: "rtl" }}>
          در حال بارگذاری...
        </div>
        <Footer />
      </>
    );
  }

  if (errMsg) {
    return (
      <>
        <Header />
        <div className="container py-5" style={{ direction: "rtl", color: "red" }}>
          {errMsg}
        </div>
        <Footer />
      </>
    );
  }

  if (!course) {
    return (
      <>
        <Header />
        <div className="container py-5" style={{ direction: "rtl" }}>
          موردی یافت نشد.
        </div>
        <Footer />
      </>
    );
  }

  // فرمت کمی بهتر برای تاریخ
  const start = new Date(course.start_time).toLocaleString();
  const end = new Date(course.end_time).toLocaleString();

  return (
    <>
      <Header />
      <div className="">
        <div className="bgbg" style={{ backgroundColor: "rgb(63, 56, 45)", position: "relative" }}>
          <img
            src={image}
            alt="تصویر اصلی"
            className="w-100 h-25 mt-5"
            style={{
              objectFit: "inherit",
              filter: "brightness(50%)",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.7)"
            }}
          />
          <div className="overlay-logo-text">
            <img
              src='https://logoyab.com/wp-content/uploads/2024/08/Noshirvani-University-of-Technology-Logo-1030x1030.png'
              alt="لوگو"
              className="small-logo"
            />
            <p className="logo-text ms-5">موسسه زبان نوشیروانی بابل</p>
          </div>
        </div>
      </div>

      <div className="teacher pb-1" style={{ backgroundColor: "#64B4DC" }}>
        <div className="container d-flex">
          <div className="logo-box mt-3">
            <img className='w-100'
              src="http://www.arkaneandishe.ir/assets/pix/202305020903337533.jpg"
              alt="teacher"
            />
          </div>
          <div className="name ms-5 mt-4" style={{ direction: "rtl" }}>
            <p style={{ color: "white", fontSize: "21px", fontWeight: "bold" }}>
              نام استاد: {course.teacher_name}
            </p>
            <p style={{ color: "white", fontSize: "21px", fontWeight: "500" }}>
              زبان: {course.language_title}
            </p>
            <p style={{ color: "white", fontSize: "21px", fontWeight: "500" }}>
              سطح: {course.level}
            </p>
            <p style={{ color: "white", fontSize: "21px", fontWeight: "500" }}>
              تاریخ شروع: {start}
            </p>
            <p style={{ color: "white", fontSize: "21px", fontWeight: "500" }}>
              تاریخ پایان: {end}
            </p>
            <p style={{ color: "white", fontSize: "21px", fontWeight: "500" }}>
              ظرفیت: {course.is_completed ? "ندارد" : "دارد"}
            </p>
            <p style={{ color: "white", fontSize: "21px", fontWeight: "500" }}>
              قیمت: {course.price}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white">
<div className="container d-flex justify-content-between bg-white">
<div className="">

    <div className="logo-box mt-2">
            <img className='w-100'
              src="http://www.arkaneandishe.ir/assets/pix/202305020903337533.jpg"
              alt="teacher"
            />
          </div>
          <p style={{ fontSize: "25px", fontWeight: "500" }}> 
نام استاد: {course.teacher_name}

</p>
</div>
<div className="mt-5">
<p style={{ fontSize: "22px", fontWeight: "500" }} className='mt-5 me-5'> 

هیچ اطلاعاتی راجب این استاد نیست
</p>
</div>
</div>
</div>

<div className="d-flex justify-content-center container">
    <div className="signcourse">
     <button onClick={handleBuy} className='view-btn mt-3 ps-5 pe-5 pt-2 pb-2'>ثبت نام دوره </button>
    </div>
</div>
      <Footer />
    </>
  );
};

export default Class;
