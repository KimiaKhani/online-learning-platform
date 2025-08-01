import React, { Component } from 'react';
import "./language.css"
import Header from './Header';
import Footer from "./Footer"
import image from "./ChatGPT Image Jul 28, 2025, 12_34_49 AM.png"

const Language=()=>{
    const data = {
        lang: "انگلیسی",
        title: `گروه زبان انگلیسی با بهره گیری از مدرسین تحصیل کرده و با توجه به متد های آموزشی جدید آماده ارائه خدمات است شامل گروه سنی خردسالان - کودکان - نوجوانان - بزرگان
      
      گروه خردسالان گروه سنی بالای 4 سال آموزش به صورت غیر مستقیم در کنار کتاب از انیمیشن ها و آهنگ های جذاب آموزشی و با استفاده از بازی، اجرای نمایش و کاردستی در محیط شاد انجام می پذیرد.
      
      کودکان شامل گروه سنی بالای 7 سال هر ترم آموزشی حدودا 30-28 ساعت آموزشی است. مطالب آموزشی با افزایش سن کودک افزایش می یابد. در این سن کودکان حروف، خواندن و نوشتن را همراه با آهنگ، بازی و با روشی جذاب یاد می‌گیرند. از فیلم های کوتاه و انیمیشن نیز استفاده می شود. مهارت speaking و listening نیز آموزش داده می‌شود. ابتدا از کتاب های first friends و بر اساس سن از کتاب starter شروع می‌شود و با تعیین سطح، زبان آموز وارد سطح نوجوان می‌شود.
      
      نوجوانان شامل 4 سطح آموزشی است که آموزش بر پایه‌ی مهارت های چهارگانه‌ی زبان speaking، listening، reading، writing است و بر اساس کتاب های family and friends صورت می‌گیرد. با توجه به سن زبان آموزان، بعد از تعیین سطح وارد دوره بزرگسالان می‌شوند.`
    , levels:["elemntry","elemntry","elemntry","elemntry","elemntry","elemntry","elemntry","elemntry","elemntry","elemntry","elemntry","elemntry"]
    ,img:"http://www.arkaneandishe.ir/assets/pix/201905081048404080.png"
 };
      
return(
    <>
    <Header />
    <div className="mt-3">
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

<div className="page-title pb-5 pt-5 ">
    <div className="container ssd pb-5">
        <img src={data.img} alt=""  className='rounded-circle'/>
        <p className='ms-2'>
{data.lang}
        </p>
    </div>
</div>
<div className="title-lang pb-2">

<div className="container ">
    <br />
    <p className=''>{data.title}</p>
</div>
</div>
    <p className='mt-3 text-center' style={{fontSize:"28px",fontWeight:"600"}} >
        سطوح مربوط به زبان {data.lang}
    </p>
      <div className="row mt-3 container ">
        {data.levels.map((value)=>(
            <>
<div className="col col-4">
<img src={data.img} alt=""  className='w-25 img-fluid tg '/>
<p className='ms-3'>{value}</p>
</div>
            </>
        ))}
      </div>



    <Footer />
    </>
)

}

export default Language;