import React, { Component, useState } from 'react';
import "./instructor.css"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // یا اگر خطا داشت از 'swiper' استفاده کن
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay } from 'swiper/modules'; // حواست باشه از این مسیر واردش کنی
import { Link, useNavigate } from "react-router-dom";


let Instructor=()=>{

const datains=[
    {name:"اقای دکتر مبین حیدری",job:"مدرس زبان انگلیسی",information:"اقای مبین حیدری مدیر موسسه‌ی زبان ارکان اندیشه‌ی بابل، مدرس بزرگسالان و دارای مدرک کارشناسی ارشد آموزش زبان انگلیسی هستند.",classes:["a1","a2","a3"]}
,    {name:"اقای دکتر مبین حیدری",job:"مدرس زبان انگلیسی",information:"اقای مبین حیدری مدیر موسسه‌ی زبان ارکان اندیشه‌ی بابل، مدرس بزرگسالان و دارای مدرک کارشناسی ارشد آموزش زبان انگلیسی هستند.",classes:["a1","a2","a3"]}
,
{name:"اقای دکتر مبین حیدری",job:"مدرس زبان انگلیسی",information:"اقای مبین حیدری مدیر موسسه‌ی زبان ارکان اندیشه‌ی بابل، مدرس بزرگسالان و دارای مدرک کارشناسی ارشد آموزش زبان انگلیسی هستند.",classes:["a1","a2","a3"]}
,
{name:"اقای دکتر مبین حیدری",job:"مدرس زبان انگلیسی",information:"اقای مبین حیدری مدیر موسسه‌ی زبان ارکان اندیشه‌ی بابل، مدرس بزرگسالان و دارای مدرک کارشناسی ارشد آموزش زبان انگلیسی هستند.",classes:["a1","a2","a3"]}
,
{name:"اقای دکتر مبین حیدری",job:"مدرس زبان انگلیسی",information:"اقای مبین حیدری مدیر موسسه‌ی زبان ارکان اندیشه‌ی بابل، مدرس بزرگسالان و دارای مدرک کارشناسی ارشد آموزش زبان انگلیسی هستند.",classes:["a1","a2","a3"]}
,
{name:"اقای دکتر مبین حیدری",job:"مدرس زبان انگلیسی",information:"اقای مبین حیدری مدیر موسسه‌ی زبان ارکان اندیشه‌ی بابل، مدرس بزرگسالان و دارای مدرک کارشناسی ارشد آموزش زبان انگلیسی هستند.",classes:["a1","a2","a3"]}
,
{name:"اقای دکتر مبین حیدری",job:"مدرس زبان انگلیسی",information:"اقای مبین حیدری مدیر موسسه‌ی زبان ارکان اندیشه‌ی بابل، مدرس بزرگسالان و دارای مدرک کارشناسی ارشد آموزش زبان انگلیسی هستند.",classes:["a1","a2","a3"]}
,    {name:"اقای دکتر مبین حیدری",job:"مدرس زبان انگلیسی",information:"اقای مبین حیدری مدیر موسسه‌ی زبان ارکان اندیشه‌ی بابل، مدرس بزرگسالان و دارای مدرک کارشناسی ارشد آموزش زبان انگلیسی هستند.",classes:["a1","a2","a3"]}

,
{name:"اقای دکتر مبین حیدری",job:"مدرس زبان انگلیسی",information:"اقای مبین حیدری مدیر موسسه‌ی زبان ارکان اندیشه‌ی بابل، مدرس بزرگسالان و دارای مدرک کارشناسی ارشد آموزش زبان انگلیسی هستند.",classes:["a1","a2","a3"]}
,
{name:"اقای دکتر مبین حیدری",job:"مدرس زبان انگلیسی",information:"اقای مبین حیدری مدیر موسسه‌ی زبان ارکان اندیشه‌ی بابل، مدرس بزرگسالان و دارای مدرک کارشناسی ارشد آموزش زبان انگلیسی هستند.",classes:["a1","a2","a3"]}
,
{name:"اقای دکتر مبین حیدری",job:"مدرس زبان انگلیسی",information:"اقای مبین حیدری مدیر موسسه‌ی زبان ارکان اندیشه‌ی بابل، مدرس بزرگسالان و دارای مدرک کارشناسی ارشد آموزش زبان انگلیسی هستند.",classes:["a1","a2","a3"]}

]


  


return(
<>
<div className="teacher mt-5 ">
    <div className="d-flex container justify-content-between ">
        <h2 className='mt-4'>اساتید</h2>
    <Link as={Link} to="/instructors"> <button className='mt-4 seen' >مشاهده همه</button></Link>   
    </div>
<Swiper className='container teacher1  ' style={{ height: 'auto' }}
modules={[Autoplay]}
autoplay={{
  delay: 2200,     // یعنی هر ۳ ثانیه یه اسلاید
  disableOnInteraction: false, // وقتی کاربر کلیک کرد متوقف نشه
}}
loop={true}    
  spaceBetween={10}
  breakpoints={{
    0: { slidesPerView: 1 },
    768: { slidesPerView: 2 },
    992: { slidesPerView: 3 },
    1200: { slidesPerView: 4 },
  }}
>    {datains.map((value, index) => (
     <SwiperSlide key={index} className='mt-3 pb-5'>
 <div className="ostad w-100 d-flex justify-content-between " key={index} >
        <div className="logo-box ms-2 mt-1">
          <img className='w-100'
            src="http://www.arkaneandishe.ir/assets/pix/202305020903337533.jpg"
            alt=""
          />
        </div>
        <div className="title me-3 mt-3 ">
          <p style={{fontSize:"23px"}}>{value.name}</p>
          <p style={{ color: "#777" ,fontSize:"21px"}}>{value.job}</p>
        </div>
      </div>
      </SwiperSlide>

    ))}
</Swiper>
</div>








</>





)





}


export default Instructor;