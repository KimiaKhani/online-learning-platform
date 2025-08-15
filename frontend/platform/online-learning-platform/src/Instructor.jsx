import React, { Component, useEffect, useState } from 'react';
import "./instructor.css"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // یا اگر خطا داشت از 'swiper' استفاده کن
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules'; // حواست باشه از این مسیر واردش کنی
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';


const Instructor = () => {
  const [datains, setDatains] = useState([]);
  const navigate = useNavigate(); // ← اضافه شده

  useEffect(() => {
    const Updateins = async () => {
      try {
        const response = await axios.get("http://localhost:8000/teacher/all");
        setDatains(response.data);
        console.log(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.detail || "خطای ناشناخته";
        alert("خطا در خواندن اطلاعات: " + errorMessage);
      }
    };
    Updateins();
  }, []);

  const handleClick = (teacher) => {
    navigate("/instructors", { state: teacher });
  };

  return (
    <>
      <div className="teacher mt-5">
        <div className="d-flex container justify-content-between">

          <h2 className='mt-4'>اساتید</h2>
          <Link as={Link} to="/instructors"> <button className='mt-4 seen' >مشاهده همه</button></Link>

        </div>

        <Swiper className='container teacher1'
          modules={[Autoplay]}
          autoplay={{ delay: 2200, disableOnInteraction: false }}
          loop={true}
          spaceBetween={10}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
          }}
        >
          {datains.map((value, index) => (
            <SwiperSlide key={index} className='mt-3 pb-5'>
              <div
                className="ostad w-100 d-flex justify-content-between"
                onClick={() => handleClick(value)} // ← کلیک روی کل باکس
                style={{ cursor: "pointer" }}      // ← نشون دادن حالت کلیک
              >
                <div className="logo-box ms-2 mt-1">
                  <img className='w-100'
                    src="http://www.arkaneandishe.ir/assets/pix/202305020903337533.jpg"
                    alt=""
                  />
                </div>
                <div className="title me-5 mt-3">
                  <p style={{ fontSize: "23px" }}>{value.username}</p>
                  <p style={{ color: "#777", fontSize: "21px" }}>{value.language_titles?.[0]}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};


export default Instructor;
