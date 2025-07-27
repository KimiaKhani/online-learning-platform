import React, { Component,useEffect,useState } from 'react';
import Header from './Header';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // یا اگر خطا داشت از 'swiper' استفاده کن
import 'swiper/css';
import 'swiper/css/navigation';
import "./home.css"
import Instructor from './Instructor';
const Home=()=>{

let dataa=[{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "}
,{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "},
{lan:"قرانسه",level:18,course:12,available:1,
img:"http://www.arkaneandishe.ir/assets/pix/201905081045154281.png",information:"سلاممم شسیسشیش سسشی شسی شس یشسی شسیشس  یشسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسی شسسی "}
]
 
const openacoordion = (clickedIndex) => {
  setTimeout(() => {
    setIndex(clickedIndex); 
    setOpenIndex(prev => prev === clickedIndex ? null : clickedIndex);
  }, 30);
}

const [openIndex,setOpenIndex]=useState(false);
const [index,setIndex]=useState(null);
return(
    <>
<Header />    
    <div className=" tatt mt-5" >

    <Swiper navigation={true} modules={[Navigation]} className='swiper-container-custom '>
    <SwiperSlide>
  <div className="slide-wrapper">
    <img
      className="img-fluid w-100"
      src="http://www.arkaneandishe.ir/assets/pix/202406121020074571.jpg"
      alt="slide 1"
    />
    <div className="box-text">
      <p>ثبت نام زبان آلمانی (شروع ترم جدید از خرداد)</p>
    </div>
  </div>
</SwiperSlide>

  <SwiperSlide>
  <div className="slide-wrapper">
    <img
      className="img-fluid w-100"
      src="http://www.arkaneandishe.ir/assets/pix/202406121020074571.jpg"
      alt="slide 1"
    />
    <div className="box-text">
      <p>ثبت نام زبان آلمانی (شروع ترم جدید از خرداد)</p>
    </div>
  </div>
</SwiperSlide>

</Swiper>

</div>
    
<div className=" static d-flex justify-content-center">
  <div className="container d-flex justify-content-between gap-3 w-100 flex-nowrap">
    {[...Array(3)].map((_, idx) => (
      <div key={idx} style={{ flex: 1, maxWidth: "29%", padding: "0 8px" }}>
        <svg
          viewBox="0 0 300 200"
          width="100%"
          height="auto"
          preserveAspectRatio="xMidYMid meet"
        >
          <ellipse
            cx="150"
            cy="100"
            rx="80"
            ry="70"
            fill="skyblue"
            stroke="yellow"
            strokeWidth="3"
            strokeDasharray="4, 10"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0px 8px 10px rgba(0, 0, 0, 0.5))" }}
          />
          <text
            x="150"
            y="85"
            textAnchor="middle"
            fill="rgb(240, 128, 128)"
            fontWeight="bold"
            fontSize="20px"
            fontFamily="sans-serif"
          >
            3000
          </text>
          <text
            x="150"
            y="125"
            textAnchor="middle"
            fill="rgb(240, 128, 128)"
            fontWeight="bold"
            fontSize="20px"
            fontFamily="sans-serif"
          >
            زبان‌آموز
          </text>
        </svg>
      </div>
    ))}
  </div>
</div>
<h1 className='mt-4 text-center departeman'>
  دپارتمان های اموزش زبان
</h1>


<div className="courses container d-flex justify-content-between mt-4">
<div className="row dsd   justify-content-center  ">
  {
    dataa.map((value,index)=>(
      <>
      <div className="col col-lg-3 col-sm-5 col-10 ms-3 px-0 course  mt-4 ">
      <div className="img-country mt-3 ms-3">
        <img src={value.img} className='w-25 rounded-circle ' alt="" />
      </div>
      <div className="titles ms-2">
        <p className='mt-2'> سطوح : {value.level} سطح</p>
        <p className='mt-2'>دوره ها : {value.course} دوره</p>
        <p className='mt-2'>کلاس های قابل ثبت نام : {value.available} مورد</p>
      </div>
   {!openIndex&&( <>
      <div className="accordionn d-flex justify-content-center pt-2 pb-2"
     onClick={() => openacoordion(index)}>
     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16" >
  <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
</svg>

      </div>
</>   )
}
    {
  openIndex === index  &&(
    <>
     <div className="tozihat">
      <p>{dataa[index].information}</p>
    </div>
    <div className="accordionn d-flex justify-content-center pt-2 pb-2"
         onClick={() => openacoordion(index)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16" >
  <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
</svg>

      </div>
    </>
  )
}
      </div>
      
      </>
    ))
  }
</div>


</div>
<Instructor />


    </>
)


}
export default Home;