import React, { useState } from 'react';
import './course.css';
import image from "./DD3OqPm4QLySsso2LoMQrQ.webp"

const Dropdown = () => {
    const [language, setLanguage] = useState('');
    const [level, setLevel] = useState('');
    const [course, setCourse] = useState('');
    const [courses, setCourses] = useState([])
    const [showcourse, setShowcourse] = useState(false)
    const handleSearch = () => {
        const newCourses = [];

        for (let i = 0; i < 5; i++) {
            newCourses.push({ name: "elementary", lan: language, level: level });
        }
        setCourses(newCourses);
        setShowcourse(true);

    };

    return (
        <>
            <div className="dropdown-container mt-3">
                <div className="dropdown-group ">
                    <label className='ms-4'>انتخاب زبان</label>
                    <select className='' value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="" className=''>انتخاب کنید</option>
                        <option value="english" >انگلیسی</option>
                        <option value="french">فرانسوی</option>
                        <option value="german">آلمانی</option>
                    </select>
                </div>

                <div className="dropdown-group">
                    <label className='ms-4'>انتخاب سطح</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value)}>
                        <option value="">ابتدا زبان را انتخاب کنید</option>
                        <option value="beginner">مبتدی</option>
                        <option value="intermediate">متوسط</option>
                        <option value="advanced">پیشرفته</option>
                    </select>
                </div>

                <div className="dropdown-group">
                    <label className='ms-4'>انتخاب دوره</label>
                    <select value={course} onChange={(e) => setCourse(e.target.value)}>
                        <option value="">ابتدا سطح را انتخاب کنید</option>
                        <option value="grammar">گرامر</option>
                        <option value="conversation">مکالمه</option>
                        <option value="writing">نوشتن</option>
                    </select>
                </div>

                <button className="search-button pt-2 pb-2 ps-5 pe-5  ms-sm-5 ms-0 " onClick={handleSearch}>
                    جستجو
                </button>
            </div>
            {
                showcourse && (
                    <>
                        <div className="container mt-3">
                            <div className="row">
                                {courses.map((value) => (

                                    <>

                                  <div className="col col-md-4 col-sm-6 col-12 sss mt-5">
                                  <img
      src={image}
      alt="تصویر اصلی"
      className="w-75 "
      style={{
        objectFit: "inherit",
        filter: "brightness(80%)",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.7)"
      }}
    />
    <div className="tes">
    <p>{value.level}</p>
    <p>{value.lan}</p>
    <p>{value.name}</p>
    </div>
  


                                  </div>


                                    </>

                                ))}

                            </div>

                        </div>
                    </>
                )
            }
        </>
    );
};

export default Dropdown;
