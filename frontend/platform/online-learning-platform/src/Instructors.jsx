import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Link,useNavigate } from 'react-router-dom';
import Header from './Header';
import image from "./ChatGPT Image Jul 28, 2025, 12_34_49 AM.png"
import Footer from './Footer';

let Instructors=()=>{
let data= {name:"اقای دکتر مبین حیدری",job:"مدرس زبان انگلیسی",information:"اقای مبین حیدری مدیر موسسه‌ی زبان ارکان اندیشه‌ی بابل، مدرس بزرگسالان و دارای مدرک کارشناسی ارشد آموزش زبان انگلیسی هستند.",classes:["a1","a2","a3"]}
return(
    <>
<Header />
<div className="">
    <div className="bgbg" style={{backgroundColor:"rgb(63, 56, 45)"}}>
        <img src={image} alt="" className='w-100 h-25 mt-5'  style={{
                objectFit: " inherit",  // حفظ نسبت ابعاد تصویر
                filter: "brightness(50%)",  // ایجاد افکت تاریکی
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.7)",  // سایه اضافه به تصویر
            }}  />
    </div>
</div>
<div className="teacher pb-5" style={{backgroundColor:"#64B4DC"}} >
    <div className="container d-flex ">
    <div className="logo-box  mt-3">
          <img className='w-100'
            src="http://www.arkaneandishe.ir/assets/pix/202305020903337533.jpg"
            alt=""
          />
        </div>    
        <div className="name ms-5 mt-4">
<p style={{color:"white" ,fontSize:"27px",fontWeight:"bold"}}>            اقای مبین حیدری
</p>            
<p style={{color:"white" ,fontSize:"24px" ,fontWeight:"500"}}> زبان : انگلیسی</p>
            </div>    
        </div> 

</div>
<div className="container moarefi mt-5" >
<p>اقای حیدری، دارای مدرک کارشناسی ارشد زبان فرانسه می‌باشند. ایشان فارغ‌التحصیل از دانشگاه تهران و دارای 8 سال سابقه تدریس در موسسات تهران و بابل هستند. علاوه بر این، ایشان مترجمی متون فرانسه و سابقه‌ی تدریس خصوصی را نیز در پرونده خود دارند. اقای حیدری تدریس برای گروه‌های سنی کودکان را نیز به عهده دارند، و آن‌ها را برای مهاجرت و یادگیری زبان فرانسه آماده می‌سازند</p>

</div>

<Footer />

    </>
)





}


export default Instructors;