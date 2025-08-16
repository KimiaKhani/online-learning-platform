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
  const [otpModal, setOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [timer, setTimer] = useState(180); // 3 دقیقه
  const [signupPhone, setSignupPhone] = useState(""); // ذخیره شماره تلفن برای تأیید
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [languages,setLanguages]=useState([])

  const [menuOpen, setMenuOpen] = useState(false); // باز بودن همبرگر
  const [langOpen, setLangOpen] = useState(false); // باز بودن زیرمنوی زبان‌ها




/*

اپدیت زبان ها در نوبار
*/ 
useEffect(() => {
  const open = () => setIsOpen(true);
  window.addEventListener('open-auth-modal', open);
  return () => window.removeEventListener('open-auth-modal', open);
}, []);


useEffect(() => {
  const fetchLanguages = async () => {
    try {
      const res = await axios.get("http://localhost:8000/language/all");
      setLanguages(res.data);
      console.log(res.data)
    } catch (er) {
      console.error("خطا در گرفتن کورس:", er);
    }
  };

  fetchLanguages();
}, []);






  /*

اپدیت رمز و یوزرنیم اگر شده کاربر اینجا دوباره باید لاگین کند

*/



useEffect(() => {
  const fetchMe = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || !role) return;

    const path = role === "admin" ? "admin/me" : role === "teacher" ? "teacher/me" : "student/me";

    axios.get(`http://localhost:8000/${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      setUser(res.data);
      setStatuslogin(true);
      setPhone(res.data.phonenumber || ""); // این همون چیزی‌ست که نشون میدی
    }).catch(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setStatuslogin(false);
      setPhone("");
    });
  };

  // بارِ اول
  fetchMe();

  // هر وقت پروفایل آپدیت شد
  const handler = () => fetchMe();
  window.addEventListener("user:profile-updated", handler);
  return () => window.removeEventListener("user:profile-updated", handler);
}, []);
/*


اپدیت رمز و یوزرنیم اگر شده کاربر اینجا دوباره باید لاگین کند




*/
  useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role) {
    const path = role === "admin" ? "admin/me" : role === "teacher" ? "teacher/me" : "student/me";
    
    axios.get(`http://localhost:8000/${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      setUser(res.data);
      setStatuslogin(true);
      setPhone(res.data.phonenumber);
      
    }).catch((err) => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setStatuslogin(false);
      setPhone("");
    });
  }
}, []);

  
  useEffect(() => {
    let countdown;
    if (otpModal && timer > 0) {
      countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [otpModal, timer]);
    

  const handleAdminOrTeacherLogin = async (e) => {
    e.preventDefault();
  
    const params = new URLSearchParams();
    params.append("username", name);
    params.append("password", password);
  
    try {
      const response = await axios.post("http://localhost:8000/authentication/token", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
  
      if (response.status === 200) {
        const { access_token, role } = response.data;
  
        localStorage.setItem("token", access_token);
        localStorage.setItem("role", role);
  
        alert(`ورود ${role === "admin" ? "ادمین" : "معلم"} موفقیت‌آمیز بود.`);
  
        setIsOpen(false);
  
        // مسیر مناسب
        if (role === "admin") {
          window.location.href = "/adminpanel";
        } else if (role === "teacher") {
          window.location.href = "/teacherpanel";
        }
      }
    } catch (err) {
      alert("خطا در ورود: " + (err.response?.data?.detail || "نامشخص"));
    }
  };
  

  const checkclick = (choice,e) => {
    e.preventDefault();
    setCheck(choice);     // فقط محتوای داخل مدال رو عوض کن
    setIsOpen(true);      // اگر مدال باز نیست، بازش کن (اگه بازه، کاری نمی‌کنه)
  };

  const handlesubmitlogin = async (e) => {
    e.preventDefault();
  
    const  params = new URLSearchParams();
    params.append("username", name);
    params.append("password", password);
  
    try {
      const response = await axios.post(
        "http://localhost:8000/authentication/token", // ✅ مسیر درست
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
  
      if (response.status === 200) {
        alert("ورود موفقیت‌آمیز.");
        const token = response.data.access_token;
        const role = response.data.role; // 👈 نقش رو هم می‌گیری
        localStorage.setItem("token", token);
        localStorage.setItem("role", role); // 👈 ذخیره نقش برای later use
        setIsOpen(false);
        setStatuslogin(true);
  
        // 👇 گرفتن اطلاعات کاربر بعد از ورود
        const path = role === "admin" ? "admin/me" : role === "teacher" ? "teacher/me" : "student/me";
        axios.get(`http://localhost:8000/${path}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res) => {
          setPhone(res.data.phonenumber); // اگر فیلدی دیگه هست، اینجا بردار
        });
      }
  
    } catch (err) {
      alert("خطا در ورود: " + (err.response?.data?.detail || "نامشخص"));
    }
  };
  
  
  const handlesubmitsign = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/student/signup",
        { phonenumber: phone }, // 👈 مستقیم از state استفاده کن
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (response.status === 200) {
        alert("کد تأیید شما: " + response.data.verify_code); // 👈 نمایش کد در alert
  
        setSignupPhone(phone); // حالا اینجا ذخیره کن
        setIsOpen(false);
        setOtpModal(true);
        setTimer(180); // ریست تایمر
  
        // ذخیره نقش در توکن بعد از دریافت اطلاعات بیشتر (در صورتی که role ارسال بشه)
        if (response.data.role) {
          localStorage.setItem("role", response.data.role); // ذخیره نقش
        }
      }
    } catch (err) {
      alert("خطا در ارسال شماره: " + (err.response?.data?.detail || "نامشخص"));
    }
  };
  
  
  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/student/verify", {
        phonenumber: signupPhone,
        code: otpCode,
        password: password,  // 👈 اینو اضافه کن
      });
  
      if (response.status === 200) {
        alert("ثبت‌نام موفقیت‌آمیز بود.");
        localStorage.setItem("token", response.data.access_token);
        setOtpModal(false);
        setStatuslogin(true);
        setShowDetailsModal(true);
      }
    } catch (err) {
      alert("کد یا رمز اشتباه است.");
    }
  };
  
  
  const handleSubmitDetails = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
    const data = {
      username: name,
      email: email,
      national_code: codemeli,
    };
  
    try {
      await axios.put("http://localhost:8000/student/update_info", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("ثبت‌نام کامل شد!");
      setShowDetailsModal(false);
      setStatuslogin(true);
    } catch (err) {
      alert("خطا در ثبت اطلاعات: " + err?.response?.data?.detail || "خطای ناشناخته");
    }
  };
  
    
const showlan=()=>{
  setTimeout(() => {
    setShowLanguage(true)
    
  }, 100);

}

  return (
    <>
    <div className="" style={{backgroundColor:"rgb(236, 240, 241)"}}>
   <div className="container px-md-0 head d-flex flex-wrap flex-md-nowrap align-items-center mt-3 justify-content-between" >
    {/* ناوبری دسکتاپ */}
    <div className="navvv d-none d-md-block position-relative order-md-1">
      <nav className="navv d-flex gap-lg-5 gap-3 position-relative">
        <Link to="/"><p>صفحه اصلی</p></Link>

        <div
          className="position-relative"
          onMouseEnter={showlan}
          onMouseLeave={() => setShowLanguage(false)}
        >
          <Link to="/language/english"><p>زبان ها</p></Link>

          {showlanguage && (
            <div className="zabanha position-absolute">
              {languages.map((value) => (
                <Link key={value.id} to={`/language/${value.title}`}>
                  <p>{value.title}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link to="/course"><p>کلاس های فعال</p></Link>
        <Link to="/contact"><p>تماس با ما</p></Link>
        <Link to="/information"><p>درباره ما</p></Link>
      </nav>
    </div>

    {/* همبرگر (فقط موبایل) */}
    <div
      className="hamburger-container d-block d-md-none order-1"
      onClick={() => setMenuOpen(!menuOpen)}
      aria-label="toggle menu"
      role="button"
    >
      <div className="hamburger">
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>
    </div>

    {/* دکمه‌های ورود/پنل — در موبایل کنار همبرگر بمانند، در دسکتاپ سمت مقابل ناوبری */}
    <div className="order-2 order-md-2 d-flex align-items-center gap-2 ms-auto ">
      {statuslogin ? (
        <div className="iam me-lg-4 me-md-3 me-1" role="group">
          <Link to={"/userpanel"}>
            <button className="btn btn-login me-md-4 me-2">{phone}</button>
          </Link>
        </div>
      ) : (
        <>
          <div className="iam me-lg-4 me-md-3 me-1" role="group">
            <button
              className="btn btn-login me-md-4 me-2"
              onClick={(e) => { checkclick("login", e); }}
            >
              ورود
            </button>
            <button
              className="btn btn-login"
              onClick={(e) => { checkclick("signup", e); }}
            >
              ثبت نام
            </button>
          </div>

          <button
            className="btn btn-info"
            onClick={(e) => { checkclick("admin", e); }}
          >
            ورود ادمین/معلم
          </button>
        </>
      )}
    </div>

    {/* منوی موبایل: سطرِ بعد (w-100) — در دسکتاپ مخفی */}
    {menuOpen && (
      <div className="mobile-menu w-100 d-block d-md-none order-3">
        <Link to="/" onClick={() => setMenuOpen(false)}>صفحه اصلی</Link>

        <div className="mt-2">
          <button
            className="btn w-100 text-start"
            onClick={() => setLangOpen(!langOpen)}
          >
            زبان‌ها {langOpen ? "▲" : "▼"}
          </button>

          {langOpen && (
            <div className="ps-3">
              {languages.map((value) => (
                <Link
                  key={value.id}
                  to={`/language/${value.slug}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {value.title}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link to="/course" className='mt-1'><p>کلاس های فعال</p></Link>
        <Link to="/contact" className='mt-1'><p>تماس با ما</p></Link>
        <Link to="/information" className='mt-1'><p>درباره ما</p></Link>
      </div>
    )}
  </div> 
      <Modal
  isOpen={isOpen}
  onRequestClose={() => setIsOpen(false)}
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000, // مقدار بالا برای اطمینان از اینکه روی همه چی قرار بگیره
    },
    content: {
      zIndex: 1001,
      maxWidth: check === "signup" ? "600px" : "550px",
      margin: 'auto',
      padding: '10px',
      borderRadius: '10px',
      backgroundColor: "#ECF0F1",
      height: check === "signup" ? "420px" : "550px",
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
نام کاربری
              </p>
              <div className="ms-2">
                <input type="text" className=' pt-2 pb-2 form-control ' onChange={(e)=>{setName(e.target.value)}}/>
              </div>
              <p className='password mt-3 ms-2'>
                رمز عبور
              </p>
              <div className="ms-2">
              <input
  type="password"
  className="pt-2 pb-2 form-control"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>
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
                <form className="container inputt " onSubmit={(e) => { handlesubmitsign(e) }}>

   <p className='password mt-3 ms-2'>تلفن همراه</p>
  <div className="ms-2">
    <input type="text" className='pt-2 pb-2 form-control' value={phone} onChange={(e) => setPhone(e.target.value)} />
  </div>

  <button className='btn-log mt-5 ms-2 pt-2 pb-2' type='submit'>ثبت نام</button>
</form>


              </>

            )
          )}
          {
            check === "admin" && (
            <>
              <div className="container-fluid d-flex justify-content-between login mt-4">
              <p>ورود ادمین / معلم</p>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setIsOpen(false)} style={{ cursor: "pointer" }} width="20" height="20" fill="#64B4DC" viewBox="0 0 16 16">
                  <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                </svg>
              </div>
          
              <form className="container inputt" onSubmit={handleAdminOrTeacherLogin}>
              <p className='phone-number mt-4 ms-2'>نام کاربری</p>
                <div className="ms-2">
                  <input type="text" className='pt-2 pb-2 form-control'   onChange={(e) => setName(e.target.value)} />
                </div>
          
                <p className='password mt-3 ms-2'>رمز عبور</p>
                <div className="ms-2">
                  <input type="password" className='pt-2 pb-2 form-control' onChange={(e) => setPassword(e.target.value)} />
                </div>
          
                <button className='btn-log mt-5 ms-2 pt-2 pb-2' type='submit'>ورود</button>
              </form>
            </>
          )}
          
        


      </Modal>

      <Modal
  isOpen={otpModal}
  onRequestClose={() => setOtpModal(false)}
  style={{
    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: 1000 },
    content: {
      zIndex: 1001,
      maxWidth: "400px",
      margin: 'auto',
      padding: '10px',
      borderRadius: '10px',
      backgroundColor: "#ECF0F1",
      height: "300px",
    },
  }}
>
  <div className="container-fluid d-flex justify-content-between login mt-4">
    <p>کد تأیید</p>
    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setOtpModal(false)} style={{ cursor: "pointer" }} width="20" height="20" fill="#64B4DC" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
    </svg>
  </div>
  <form className="container inputt" onSubmit={verifyOtp}>
    <p className='mt-4 ms-2'>کدی که برایتان پیامک شده را وارد کنید</p>
    <input type="text" className="pt-2 pb-2 ms-2 form-control" onChange={(e) => setOtpCode(e.target.value)} />
    <p className='mt-3 ms-2'>رمز عبور</p>
<input type="password" className="pt-2 pb-2 ms-2 form-control" onChange={(e) => setPassword(e.target.value)} />

    <div className='mt-3 ms-2 text-muted'>زمان باقی‌مانده: {Math.floor(timer / 60)}:{("0" + timer % 60).slice(-2)}</div>
    <button className='btn-log mt-4 ms-2 pt-2 pb-2' type='submit'>تأیید</button>
  </form>
</Modal>


<Modal
  isOpen={showDetailsModal}
  onRequestClose={() => setShowDetailsModal(false)}
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000,
    },
    content: {
      zIndex: 1001,
      maxWidth: "600px",
      margin: 'auto',
      padding: '10px',
      borderRadius: '10px',
      backgroundColor: "#ECF0F1",
      height: "550px",
    },
  }}
>
  <div className="container-fluid d-flex justify-content-between login mt-4">
    <p>تکمیل اطلاعات</p>
    <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setShowDetailsModal(false)} style={{ cursor: "pointer" }} width="20" className='mt-2 me-3' height="20" fill="#64B4DC" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
    </svg>
  </div>

  <form className="container inputt" onSubmit={handleSubmitDetails}>
    <p className='phone-number mt-4 ms-2'> کاربری نام</p>
    <div className="ms-2">
      <input type="text" className='pt-2 pb-2 form-control' value={name} onChange={(e) => setName(e.target.value)} />
    </div>


    <p className='password mt-3 ms-2'>ایمیل</p>
    <div className="ms-2">
      <input type="email" className='pt-2 pb-2 form-control' value={email} onChange={(e) => setEmail(e.target.value)} />
    </div>

    <p className='password mt-3 ms-2'>کد ملی</p>
    <div className="ms-2">
      <input type="text" className='pt-2 pb-2 form-control' value={codemeli} onChange={(e) => setCodemeli(e.target.value)} />
    </div>

    <button className='btn-log mt-5 ms-2 pt-2 pb-2' type='submit'>ثبت اطلاعات</button>
  </form>
</Modal>

</div>

    </>
  )



}


export default Header;