import React, { Component, useState } from 'react';
import Modal from 'react-modal';
import "./header.css"
const Header=()=>{

    const [isOpen, setIsOpen] = useState(false);
    const [check,setCheck]=useState("null");
    const checkclick=(choice)=>{
        setCheck(choice)
        setIsOpen(true);
    }    

return (
    <>
    <div className="container head d-flex mt-3 justify-content-between " >
        <div className="navvv d-md-block d-none">
<nav className='navv d-flex gap-lg-5 gap-3 '>
<p>صفحه اصلی</p>
<p>زبان ها</p>
<p> کلاس های فعال</p>
<p>تماس با ما</p>
<p> درباره ما</p>
</nav>
</div>
<div className="hamburger-container d-md-none d-block ">
      <div className="hamburger">
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>
    </div>
<div className="iam me-lg-5 me-md-3 me-2   " role="group">
<button className='btn btn-login me-md-4 me-2   ' onClick={()=>{checkclick("login")}}>
ورود
</button>
<button className='btn btn-login  ' onClick={()=>{checkclick("signup")}}>
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
          maxWidth: '500px',
          margin: 'auto',
          padding: '20px',
          borderRadius: '10px',
        },
      }}
    >
      {check ==="login" && (
        <>
        <p>سلام</p>
        </>
      ) }
      {
        check ==="signup" &&(
            (
                <>
                <p>سلامممممم</p>
                </>
            )
        )
      }


      <button onClick={() => setIsOpen(false)}>بستن</button>
    </Modal>
     
    
    
    
    
    
    </>
)



}


export default Header;