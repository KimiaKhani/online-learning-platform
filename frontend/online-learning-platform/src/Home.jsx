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
    <div className="mt-5" >

    <Swiper navigation={true} modules={[Navigation]}>
  <SwiperSlide >
<div className="" style={{ position: 'relative' }}>
<img className="img-fluid w-100"
    style={{ height: 'auto', objectFit: 'cover' }} src="http://www.arkaneandishe.ir/assets/pix/202406121020074571.jpg" alt="slide 1"  />
  <div className='box-text' >
   <p>ثبت نام زبان آلمانی( شروع ترم جدید از خرداد)</p>
  </div>
</div>
  </SwiperSlide>
  <SwiperSlide>
  <div className="" style={{ position: 'relative' }}>
<img className="img-fluid w-100"
    style={{ height: 'auto', objectFit: 'cover' }} src="http://www.arkaneandishe.ir/assets/pix/202406121020074571.jpg" alt="slide 1"  />
  <div className='box-text' >
   <p>ثبت نام زبان آلمانی( شروع ترم جدید از خرداد)</p>
  </div>
</div>
 </SwiperSlide>
</Swiper>

</div>
    
    </>
)


}
export default Home;