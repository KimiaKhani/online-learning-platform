import React, { Component, useState } from 'react';
import Modal from 'react-modal';
import { default as axios } from 'axios';
import { useEffect } from 'react';
import "./header.css"
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [name,setName]=useState("");
  const [lastname,setLastname]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [codemeli,setCodemeli]=useState("");
  const[phone,setPhone]=useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [check, setCheck] = useState("null");
  const [statuslogin,setStatuslogin]=useState(false)
  const [user, setUser] = useState(null);
  const [showlanguage,setShowLanguage]=useState(false);



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:8000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          setUser(res.data);
          setStatuslogin(true);
        })
        .catch((err) => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  const checkclick = (choice) => {
    setCheck(choice);     // فقط محتوای داخل مدال رو عوض کن
    setIsOpen(true);      // اگر مدال باز نیست، بازش کن (اگه بازه، کاری نمی‌کنه)
  };

  const handlesubmitlogin=async(e)=>{
    e.preventDefault();
    const data={phone:phone,password:password}
    const response=await axios.post("http://localhost:8000/auth/login",data,{
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    
    if (response.status===200){
      alert("ورود موفقیت‌آمیز.");
      localStorage.setItem("token", response.data.token);
      setIsOpen(false);
      setStatuslogin(true)
    }
    else{
      alert("خطا در ورود: ");
    }
  }
  
const handlesubmitsign=async(e)=>{
const data={name:name,lastname:lastname,phone:phone,email:email,codemeli:codemeli,password:password};
let response=await axios.post("http://localhost:8000/auth/login",data,{
headers:{"Content-Type" : "application/x-www-form-urlencoded"},
});
if(response.status==200){
  localStorage.setItem("token", response.data.token);
  setIsOpen(false)
setStatuslogin(true)
}
}

const showlan=()=>{
  setTimeout(() => {
    setShowLanguage(true)
    
  }, 100);

}

  return (
    <>
    <div className="container px-md-0 head d-flex mt-3 justify-content-between">
  <div className="navvv d-md-block d-none position-relative">
    <nav className="navv d-flex gap-lg-5 gap-3 position-relative">
     <Link as={Link} to={"/"}> <p>صفحه اصلی</p></Link>

      <div
  className="position-relative"
  onMouseEnter={showlan}
  onMouseLeave={() => setShowLanguage(false)}
>
  <Link as={Link} to="/language/english"><p>زبان ها</p></Link>

  {showlanguage && (
    <div className="zabanha position-absolute">
      <Link as={Link} to="/language/english"><p>انگلیسی</p></Link>
      <Link as={Link} to="/language/french"><p>فرانسوی</p></Link>
      <Link as={Link} to="/language/arabic"><p>عربی</p></Link>
      <Link as={Link} to="/language/german"><p>آلمانی</p></Link>
      <Link as={Link} to="/language/turkish"><p>ترکی</p></Link>
    </div>
  )}
</div>

   <Link as={Link} to="/course" >  <p>کلاس های فعال</p></Link> 
      <Link as={Link} to="/contact"><p>تماس با ما</p></Link>
      <Link as={Link} to="/information"><p>درباره ما</p></Link>
    </nav>
  </div>

        <div className="hamburger-container d-md-none d-block      ">
          <div className="hamburger ">
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </div>
        </div>
        {
          statuslogin ? (
            <>
             <div className="iam me-lg-4 me-md-3 me-1   " role="group">
          <button className='btn btn-login me-md-4 me-2   ' onClick={() => { checkclick("login") }}>
            {phone}
          </button>
          
        </div>
            </>
          )
          :
          (
            <>
             <div className="iam me-lg-4 me-md-3 me-1   " role="group">
          <button className='btn btn-login me-md-4 me-2   ' onClick={() => { checkclick("login") }}>
            ورود
          </button>
          <button className='btn btn-login  ' onClick={() => { checkclick("signup") }}>
            ثبت نام
          </button>
        </div>
            </>
          )
        }
       
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
            <form className="container inputt " onSubmit={(e) => { handlesubmitlogin(e) }}>
              <p className='phone-number mt-4 ms-2'>
                شماره تلفن
              </p>
              <div className="ms-2">
                <input type="text" className=' pt-2 pb-2 ' onChange={(e)=>{setPhone(e.target.value)}}/>
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
                    کد ملی
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