import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import Dropdown from './Dropdown';
import "./instructor.css"
import image from "./ChatGPT Image Jul 28, 2025, 12_34_49 AM.png"

let Course=()=>{
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
<Dropdown />
  

          <Footer />
        </>
    )

}

export default Course