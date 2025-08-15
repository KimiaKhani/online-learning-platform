import React, { useEffect, useState } from 'react';
import './course.css';
import image from "./DD3OqPm4QLySsso2LoMQrQ.webp";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dropdown = () => {
    const [languages, setLanguages] = useState([]);
    const [language, setLanguage] = useState('');
    const [level, setLevel] = useState('');
    const [courses, setCourses] = useState([]);
    const [showcourse, setShowcourse] = useState(false);
    const [isCompleted, setIsCompleted] = useState('');

    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

    // گرفتن زبان‌ها از API
    useEffect(() => {
        axios.get("http://localhost:8000/language/all")
            .then((res) => {
                setLanguages(res.data);
            })
            .catch((err) => {
                console.error("خطا در گرفتن زبان‌ها:", err);
            });
    }, []);

    const handleSearch = () => {
        axios.get("http://localhost:8000/course/filter", {
            params: {
                language_title: language,
                level: level,
                is_completed: isCompleted === '' ? null : isCompleted === 'true'
            }
        })

            .then((res) => {
                setCourses(res.data);
                setShowcourse(true);
            })
            .catch((err) => {
                console.error("خطا در گرفتن کورس:", err);
            });
    };

    return (
        <>
            <div className="dropdown-container mt-3">
                <div className="dropdown-group">
                    <label className='ms-4'>انتخاب زبان</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="">انتخاب کنید</option>
                        {languages.map((lang) => (
                            <option key={lang.id} value={lang.title}>{lang.title}</option>
                        ))}
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor" className="bi bi-arrow-down position-absolute   translate-middle-y pointer-events-none" style={{ top: "402px", right: "700px" }}>
                        <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1" />
                    </svg>
                </div>

                <div className="dropdown-group">
                    <label className='ms-4'>انتخاب سطح</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value)}>
                        <option value="" className=''>

                            انتخاب کنید

                        </option>

                        {levels.map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl}</option>

                        ))}
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor" className="bi bi-arrow-down position-absolute   translate-middle-y pointer-events-none" style={{ top: "402px", right: "490px" }}>
                        <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1" />
                    </svg>
                </div>
                <div className="dropdown-group">
                    <label className='ms-4'>وضعیت کلاس</label>
                    <select value={isCompleted} onChange={(e) => setIsCompleted(e.target.value)}>
                        <option value="">همه</option>
                        <option value="false">فعال</option>
                        <option value="true">غیرفعال</option>
                    </select>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        fill="currentColor" className="bi bi-arrow-down position-absolute   translate-middle-y pointer-events-none" style={{ top: "402px", right: "870px" }}>
                        <path fillRule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1" />
                    </svg>
                </div>

                <button className="search-button pt-2 pb-2 ps-5 pe-5 ms-sm-5 ms-0" onClick={handleSearch}>
                    جستجو
                </button>
            </div>

            {
                showcourse && (
                    <div className="container mt-3">
                        <div className="row">
                            {courses.map((value,key) => (


                                <div className="col col-md-4 col-sm-6 col-12 mt-4">
                                    <div className="custom-card">
                                        <div className="card-image-wrapper">
                                            <img src={image} alt="course" className="card-image" />
                                            <div className="card-overlay">
                                                <p className="text-white mb-1">زبان: {value.language_title}</p>
                                                <p className="text-white mb-1">سطح: {value.level}</p>
                                                <p className="text-white">معلم: {value.teacher_name}</p>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                        <Link to={`/class/${value.id}`}>   <button className="view-btn">مشاهده</button></Link> 
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Dropdown;
