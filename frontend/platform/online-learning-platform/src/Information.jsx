import React, { Component } from 'react';
import Header from './Header';
import "./instructor.css"
import image from "./ChatGPT Image Jul 28, 2025, 12_34_49 AM.png"
import Footer from './Footer';

let Information=()=>{
return(

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

    {/* لوگو و متن در گوشه بالا-راست */}
    <div className="overlay-logo-text">
      <img
src='https://logoyab.com/wp-content/uploads/2024/08/Noshirvani-University-of-Technology-Logo-1030x1030.png'
alt="لوگو"
        className="small-logo"
      />
      <p className="logo-text ms-5">
      موسسه زبان نوشیروانی بابل
      </p>
    </div>
  </div>
</div>

<div className="page-title pb-4 pt-4 ">
    <div className="container">
        <p className='ms-2'>
            درباره ما
        </p>
    </div>
</div>

<div className="container mt-4 ttile">
    <p>موسسه ارکان اندیشه زبان بابل با بیش از 10 سال سابقه با داشتن مجموعه کامل از زبان های دنیا (انگلیسی، فرانسه، ترکی، آلمانی، روسی، ایتالیایی و عربی) در رده های سنی کودکان نوجوانان و بزرگسالان، آماده ارائه خدمات آموزشی به زبان آموزان عزیز در یادگیری زبان دلخواهشان می باشد.
این موسسه نیز در امر آموزش آیلتس IELTS و پری آیلتس PRE-IELTS در مقطع ADVANCED زبان آموزان را برای نمرات 4- 5/5 ، 5/5 - 7 ، 7 - 8 آماده می سازد.
مدارک این موسسه معتبر و تحت نظارت اداره فرهنگ و ارشاد اسلامی می باشد.
ارکان اندیشه با کادر خبره، متخصص و سابقه طولانی به مدیریت خانم استادزاده در هر گروه زبانی آماده خدمت رسانی به فراگیران زبان است.</p>
</div>

<Footer />







</>



)


}

export default Information;