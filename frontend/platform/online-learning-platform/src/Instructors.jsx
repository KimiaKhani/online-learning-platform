import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import image from "./ChatGPT Image Jul 28, 2025, 12_34_49 AM.png"

let Instructors = () => {
  const location = useLocation();
  const teacher = location.state;

  if (!teacher) {
    return <p className='text-center mt-5'>اطلاعات استادی یافت نشد</p>;
  }

  return (
    <>
      <Header />

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

        <div className="overlay-logo-text">
          <img
            src='https://logoyab.com/wp-content/uploads/2024/08/Noshirvani-University-of-Technology-Logo-1030x1030.png'
            alt="لوگو"
            className="small-logo"
          />
          <p className="logo-text ms-5">موسسه زبان نوشیروانی بابل</p>
        </div>
      </div>

      <div className="teacher pb-5" style={{ backgroundColor: "#64B4DC" }}>
        <div className="container d-flex">
          <div className="logo-box mt-3">
            <img className='w-100'
              src="http://www.arkaneandishe.ir/assets/pix/202305020903337533.jpg"
              alt=""
            />
          </div>
          <div className="name ms-5 mt-4">
            <p style={{ color: "white", fontSize: "27px", fontWeight: "bold" }}>{teacher.username}</p>
            <p style={{ color: "white", fontSize: "24px", fontWeight: "500" }}>
              زبان : {teacher.language_titles?.join("، ") || "نامشخص"}
            </p>
          </div>
        </div>
      </div>

      <div className="container moarefi mt-5">
        <p>{teacher.description || "اطلاعات تکمیلی برای این استاد موجود نیست."}</p>
      </div>

      <Footer />
    </>
  );
};

export default Instructors;

