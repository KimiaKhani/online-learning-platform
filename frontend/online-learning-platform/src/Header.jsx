import React, { Component, useState } from 'react';
import Modal from 'react-modal';
import "./header.css"
const Header = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [check, setCheck] = useState("null");
  const checkclick = (choice) => {
    setCheck(choice);     // فقط محتوای داخل مدال رو عوض کن
    setIsOpen(true);      // اگر مدال باز نیست، بازش کن (اگه بازه، کاری نمی‌کنه)
  };




  return (
    <>
      <div className=" container px-md-0  head d-flex mt-3 justify-content-between  " >
        <div className="navvv d-md-block d-none">
          <nav className='navv d-flex gap-lg-5 gap-3 '>
            <p>صفحه اصلی</p>
            <p>زبان ها</p>
            <p> کلاس های فعال</p>
            <p>تماس با ما</p>
            <p> درباره ما</p>
          </nav>
        </div>
        <div className="hamburger-container d-md-none d-block      ">
          <div className="hamburger ">
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </div>
        <div className="iam me-lg-4 me-md-3 me-1   " role="group">
          <button className='btn btn-login me-md-4 me-2   ' onClick={() => { checkclick("login") }}>
            ورود
          </button>
          <button className='btn btn-login  ' onClick={() => { checkclick("signup") }}>
            ثبت نام
          </button>
        </div>
      </div>


      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            maxWidth: check === "signup" ? "600px" : "550px",
            margin: 'auto',
            padding: '10px',
            borderRadius: '10px',
            backgroundColor: "#ECF0F1",
            height: check === "signup" ? "600px" : "550px",
          },
        }}
      >

        {check === "login" && (
          <>
            <div className="container-fluid d-flex justify-content-between login mt-4">
              <p>ورود به حساب کاربری</p>

              <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setIsOpen(false)} style={{ cursor: "pointer" }} width="20" className='mt-2 me-3' height="20" fill="#64B4DC" class="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>

            </div>
            <form className="container inputt ">
              <p className='phone-number mt-4 ms-2'>
                شماره تلفن
              </p>
              <div className="ms-2">
                <input type="text" className=' pt-2 pb-2 ' />
              </div>
              <p className='password mt-3 ms-2'>
                رمز عبور
              </p>
              <div className="ms-2">
                <input type="text" className=' pt-2 pb-2 ' />
              </div>

              <button className='btn-log  mt-5  ms-2 pt-2 pb-2' type='submit'>
                ورود
              </button>
              <p className='mt-4 ms-3' >عضو جدید هستید ؟ برای ثبت نام  <a href="" onClick={(e) => {
                e.preventDefault();
                checkclick("signup"

                )
              }}>کلیک</a> کنید</p>
            </form>

          </>
        )}
        {
          check === "signup" && (
            (
              <>


                <div className="container-fluid d-flex justify-content-between login mt-4">
                  <p>عضویت</p>

                  <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setIsOpen(false)} style={{ cursor: "pointer" }} width="20" className='mt-2 me-3' height="20" fill="#64B4DC" class="bi bi-x-lg" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                  </svg>

                </div>
                <form className="container inputt ">
                  <p className='phone-number mt-4 ms-2'>
                    نام
                  </p>
                  <div className="ms-2">
                    <input type="text" className=' pt-2 pb-2 ' />
                  </div>
                  <p className='password mt-3 ms-2'>
                    نام خانوادگی
                  </p>
                  <div className="ms-2">
                    <input type="text" className=' pt-2 pb-2 ' />
                  </div>
                  <p className='password mt-3 ms-2'>
                    تلفن همراه
                  </p>
                  <div className="ms-2">
                    <input type="text" className=' pt-2 pb-2 ' />
                  </div>
                  <p className='password mt-3 ms-2'>
                    ایمیل
                  </p>

                
                  <div className="ms-2">
                    <input type="text" className=' pt-2 pb-2 ' />
                  </div>
                  <p className='password mt-3 ms-2'>
                    رمزعبور
                  </p>
                  <div className="ms-2">
                    <input type="text" className=' pt-2 pb-2 ' />
                  </div>

                  <button className='btn-log  mt-5  ms-2 pt-2 pb-2' type='submit'>
                    ثبت نام
                  </button>
                  <p className='mt-4 ms-3' >قبلا ثبت نام کرده اید ؟ برای ورود  <a href="" onClick={(e) => {
                    e.preventDefault();
                    checkclick("login")
                  }}>کلیک</a> کنید</p>
                </form>

              </>

            )
          )
        }


      </Modal>






    </>
  )



}


export default Header;