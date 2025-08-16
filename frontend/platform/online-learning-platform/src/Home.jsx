import React, { Component,useEffect,useState } from 'react';
import Header from './Header';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // یا اگر خطا داشت از 'swiper' استفاده کن
import 'swiper/css';
import 'swiper/css/navigation';
import "./home.css"
import Instructor from './Instructor';
import Footer from './Footer';
import axios from 'axios';
const Home=()=>{

  const [dataa, setDataa] = useState([]);
  const [data11,setData11]=useState([])

const [stats, setStats] = useState([
  { label: "زبان‌آموز", count: 0 },
  { label: "تعداد استاد", count: 0 },
  { label: "تعداد کلاس", count: 0 },
]);

useEffect(() => {
  axios.get("http://localhost:8000/language/statistics")
    .then((res) => {
      setDataa(res.data);
    })
    .catch((err) => {
      console.error("خطا در گرفتن آمار زبان:", err);
    });
}, []);

useEffect(() => {
  const fetchcourses = async () => {
    try {
      const res = await axios.get("http://localhost:8000/course/courses");
      setData11(res.data);
    } catch (er) {
      console.error("خطا در گرفتن کورس:", er);
    }
  };

  fetchcourses();
}, []);



useEffect(() => {
  const UpdateStatic = async () => {
    try {
      const response = await axios.get("http://localhost:8000/student/count");
      const response1 = await axios.get("http://localhost:8000/teacher/count");

      const data = response.data;
      const data1=response1.data;
      const data2=data11.length

      const updatedStats = [
        { label: "زبان‌آموز", count: data.total_students || 0 },
        { label: "تعداد استاد", count: data1.total_teachers || 0 },
        { label: "تعداد کلاس", count: data2 || 0 },
      ];

      setStats(updatedStats);
    } catch (error) {
      console.error("خطا در دریافت آمار:", error);
    }
  };

  UpdateStatic();
}, [data11]);

const getFlagForLanguage = (language) => {
  switch (language.toLowerCase()) {
    case "انگلیسی":
    case "english":
      return "https://flagcdn.com/w320/gb.png"; // پرچم بریتانیا
    case "فرانسوی":
    case "french":
      return "https://flagcdn.com/w320/fr.png"; // پرچم فرانسه
    case "آلمانی":
    case "german":
      return "https://flagcdn.com/w320/de.png"; // پرچم آلمان
    case "عربی":
    case "arabic":
      return "https://flagcdn.com/w320/sa.png"; // پرچم عربستان
    case "ترکی":
    case "turkish":
      return "https://flagcdn.com/w320/tr.png"; // پرچم ترکیه
    case "چینی":
      return "https://flagcdn.com/w320/cn.png";
    case "ژاپنی":
      return "https://flagcdn.com/w320/jp.png";
    case "اسپانیایی":
      return "https://flagcdn.com/w320/es.png";
    default:
      return "https://cdn-icons-png.flaticon.com/512/484/484582.png"; // پرچم عمومی یا globe
  }
};
  


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

<Header  />    
<div className="home-container">

    <div className=" tatt mt-5 " >

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
    
<div className="static d-flex justify-content-center" >
      <div className="container d-flex justify-content-between gap-3 w-100 flex-nowrap">
        {stats.map((item, idx) => (
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
                {item.count}
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
                {item.label}
              </text>
            </svg>
          </div>
        ))}
      </div>
    </div>
<h1 className='mt-4 text-center departeman' >
  دپارتمان های اموزش زبان
</h1>


<div className="courses container d-flex justify-content-between mt-4" >
<div className="row dsd   justify-content-center  ">
  {
    dataa.map((value,index)=>(
      <>
      <div className="col col-lg-3 col-sm-5 col-10 ms-3 px-0 course  mt-4 ">
      <div className="img-country mt-3 ms-3 d-flex">
      <img 
  src={getFlagForLanguage(value.language)} 
  className='w-25 rounded-circle' 
  alt={value.language}

/>
<h2 className='mt-2 ms-4'>{value.language}</h2>


      </div>
      <div className="titles ms-2">
      <p className='mt-2'>سطوح: {value.levels.join(", ")}</p>
<p className='mt-2'>تعداد دوره‌ها: {value.course_count}</p>
<p className='mt-2'>کلاس‌های قابل ثبت‌نام: {value.available_count}</p>

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
     <div className="tozihat" >
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
<Footer />
</div>

    </>
)


}
export default Home;