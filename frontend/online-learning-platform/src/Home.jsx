import React, { Component,useEffect,useState } from 'react';
import Header from './Header';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // یا اگر خطا داشت از 'swiper' استفاده کن
import 'swiper/css';
import 'swiper/css/navigation';
import "./home.css"
const Home=()=>{


 
return(
    <>
<Header />    
    <div className="mt-5 tatt" >

    <Swiper navigation={true} modules={[Navigation]} className='swiper-container-custom'>
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
    
<div className="static d-flex justify-content-center  ">
<div className="">
<p>salam</p>
</div>


</div>



    </>
)


}
export default Home;