import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./amin.css";
import { Helmet } from 'react-helmet';
import { Pie, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const Adminpanel = () => {
  const navigate = useNavigate();


  const [stats, setStats] = useState([
    { label: "زبان‌آموز", count: 0 },
    { label: "تعداد استاد", count: 0 },
    { label: "تعداد کلاس", count: 0 },
  ]);

  const [dataa, setDataa] = useState([]); // برای آمار زبان‌ها
  const [data11, setData11] = useState([]); // برای آمار دوره‌ها



  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8000/course/courses");
        setData11(res.data);
      } catch (err) {
        console.error("خطا در گرفتن دوره‌ها:", err);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const UpdateStatic = async () => {
      try {
        const response = await axios.get("http://localhost:8000/student/count");
        const response1 = await axios.get("http://localhost:8000/teacher/count");

        const data = response.data;
        const data1 = response1.data;
        const data2 = data11.length;

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



  // داده‌های نمودار دایره‌ای (آمار زبان‌ها)
  const pieData = {
    labels: ['زبان‌آموزها', 'زبان‌ها'],
    datasets: [{
      data: [stats[0]?.count || 0, stats[1]?.count || 0],
      backgroundColor: ['#FF6347', '#32CD32'], // رنگ‌های جدید
      hoverBackgroundColor: ['#FF4500', '#228B22'], // رنگ‌های hover جدید
    }]
  };

  // داده‌های نمودار میله‌ای (آمار دوره‌ها)
  const barData = {
    labels: ['دوره‌ها'],
    datasets: [{
      label: 'تعداد دوره‌ها',
      data: [data11.length || 0], // تعداد دوره‌ها
      backgroundColor: '#6A5ACD', // رنگ جدید
      borderColor: '#6A5ACD',
      borderWidth: 1
    }]
  };
  // ----- UI State -----
  const [activeModal, setActiveModal] = useState(null); // 'teacher' | 'course' | 'language' | 'updateCourse' | 'deleteUser' | null
  const [message, setMessage] = useState("");

  // ----- Teacher Form -----
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phonenumber: "",
    national_code: "",
    birthdate: "",
    language_titles: "",
  });
  const [chartData, setChartData] = useState({});

  // ----- Course Create Form -----
  const [courseData, setCourseData] = useState({
    language_title: "",
    teacher_name: "",
    is_online: false,
    level: "",
    start_time: "",
    end_time: "",
    is_completed: false,
    price: 0,
  });


  // ----- Course Update Form -----
  const [updateCourseData, setUpdateCourseData] = useState({
    language_title: "",
    teacher_name: "",
    is_online: false,
    level: "",
    start_time: "",
    end_time: "",
    is_completed: false,
    price: 0,
  });
  const [updateCourseId, setUpdateCourseId] = useState("");

  // ----- Language Form -----
  const [languageData, setLanguageData] = useState({
    title: "",
    description: ""
  });

  // ----- Delete User -----
  const [UserId, setUserId] = useState("");

  // ----- Auth Check -----
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("دسترسی غیرمجاز!");
      navigate("/");
    }
  }, [navigate]);

  // ----- Handlers: Shared -----
  const handleAdminLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    alert("با موفقیت خارج شدید.");
    window.location.href = "/";
  };

  // ----- Handlers: Teacher -----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (role !== "admin") {
        alert("دسترسی فقط برای ادمین‌ها مجاز است.");
        navigate("/");
        return;
      }
      if (!token) {
        setMessage("⛔ توکن ادمین پیدا نشد.");
        return;
      }

      await axios.post(
        "http://localhost:8000/teacher/create",
        {
          ...formData,
          language_titles: formData.language_titles.split(",").map(lang => lang.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ معلم با موفقیت اضافه شد.");
      setFormData({
        username: "",
        email: "",
        password: "",
        phonenumber: "",
        national_code: "",
        birthdate: "",
        language_titles: "",
      });
      setActiveModal(null);
    } catch (error) {
      console.error("خطا در افزودن معلم:", error);
      setMessage("⛔ خطا در ثبت معلم. لطفاً ورودی‌ها یا توکن را بررسی کن.");
    }
  };

  // ----- Handlers: Course Create -----
  const handleCourseChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const coursePayload = {
      ...courseData,
      start_time: new Date(courseData.start_time).toISOString(),
      end_time: new Date(courseData.end_time).toISOString(),
      level: courseData.level.toUpperCase().trim(),
      price: Number(courseData.price),
    };

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (role !== "admin") {
        alert("دسترسی فقط برای ادمین‌ها مجاز است.");
        navigate("/");
        return;
      }
      if (!token) {
        alert("⛔ توکن پیدا نشد.");
        return;
      }

      await axios.post("http://localhost:8000/course/create", coursePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ دوره با موفقیت ثبت شد.");
      setCourseData({
        language_title: "",
        teacher_name: "",
        is_online: false,
        level: "",
        start_time: "",
        end_time: "",
        is_completed: false,
        price: 0,
      });
      setActiveModal(null);
    } catch (err) {
      console.error("⛔ خطا در ثبت دوره:", err);
      alert("⛔ خطا در ثبت دوره.");
    }
  };

  // ----- Handlers: Course Update -----
  const handleUpdateCourseChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateCourseData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleUpdateCourseIdChange = (e) => setUpdateCourseId(e.target.value);

  const handleUpdateCourseSubmit = async (e) => {
    e.preventDefault();

    if (!updateCourseId) {
      alert("لطفاً شناسه کورس را وارد کنید.");
      return;
    }

    const payload = {
      ...updateCourseData,
      start_time: new Date(updateCourseData.start_time).toISOString(),
      end_time: new Date(updateCourseData.end_time).toISOString(),
      level: updateCourseData.level.toUpperCase().trim(),
      price: Number(updateCourseData.price),
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⛔ توکن پیدا نشد.");
        return;
      }

      await axios.put(
        `http://localhost:8000/course/update_info?id=${updateCourseId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ دوره با موفقیت آپدیت شد.");
      setUpdateCourseId("");
      setUpdateCourseData({
        language_title: "",
        teacher_name: "",
        is_online: false,
        level: "",
        start_time: "",
        end_time: "",
        is_completed: false,
        price: 0,
      });
      setActiveModal(null);
    } catch (err) {
      console.error("⛔ خطا در آپدیت دوره:", err);
      alert("⛔ خطا در آپدیت دوره.");
    }
  };

  // ----- Handlers: Language -----
  const handleLanguageChange = (e) => {
    const { name, value } = e.target;
    setLanguageData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLanguageSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (role !== "admin") {
        alert("دسترسی فقط برای ادمین‌ها مجاز است.");
        navigate("/");
        return;
      }

      await axios.post("http://localhost:8000/language/create", languageData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ زبان جدید با موفقیت اضافه شد.");
      setLanguageData({ title: "", description: "" });
      setActiveModal(null);
    } catch (err) {
      console.error("⛔ خطا در ثبت زبان:", err);
      alert("⛔ خطا در ثبت زبان. لطفاً فیلدها را بررسی کن.");
    }
  };

  // ----- Handlers: Delete User -----
  const handleUserId = (e) => setUserId(e.target.value);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!UserId) {
      alert("لطفاً شناسه کاربر را وارد کنید.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (role !== "admin") {
        alert("دسترسی فقط برای ادمین‌ها مجاز است.");
        navigate("/");
        return;
      }
      if (!token) {
        alert("⛔ توکن احراز هویت پیدا نشد. لطفاً مجدداً وارد شوید.");
        return;
      }

      const confirmDelete = window.confirm(`آیا از حذف کاربر با شناسه ${UserId} مطمئن هستید؟`);
      if (!confirmDelete) return;

      const response = await axios.delete(
        `http://localhost:8000/student/delete?id=${UserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("✅ کاربر با موفقیت حذف شد.");
        setUserId("");
        setActiveModal(null);
      }
    } catch (err) {
      console.error("⛔ خطا در حذف کاربر:", err);
      if (err.response) {
        if (err.response.status === 404) {
          alert("⛔ کاربر با این شناسه یافت نشد.");
        } else if (err.response.status === 403) {
          alert("⛔ شما مجوز حذف این کاربر را ندارید.");
        } else {
          alert("⛔ خطای سرور: " + (err.response.data?.detail || "نامشخص"));
        }
      } else {
        alert("⛔ خطای شبکه یا سرور رخ داده است.");
      }
    }
  };

  // ----- Styles -----
  const overlayStyle = { backgroundColor: "rgba(0,0,0,0.5)" };

  return (
    <>
      <div dir="rtl" className="bg-light min-vh-100">
        {/* Bootstrap فقط در این صفحه */}
        <Helmet>
          {/* نسخه RTL برای فارسی/راست‌به‌چپ */}
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css"
          />
          {/* اگر لازم شد JS هم می‌تونی باز کنی؛ ما بهش نیاز نداریم چون مودال‌ها با state کنترل میشن */}
          {/* <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script> */}
        </Helmet>

        {/* Layout */}
        <div className="container-fluid">
          <div className="row flex-row-reverse">
            {/* Sidebar */}
            <aside className="col-12 col-md-3 col-lg-2 bg-dark text-white p-0">
              <div className="p-3 border-bottom border-secondary d-flex align-items-center justify-content-center">
                <h5 className="m-0">🎓 پنل مدیریت</h5>
              </div>

              <div className="list-group list-group-flush">
                <button className="list-group-item list-group-item-action bg-dark text-white" onClick={() => setActiveModal("teacher")}>
                  افزودن معلم
                </button>
                <button className="list-group-item list-group-item-action bg-dark text-white" onClick={() => setActiveModal("course")}>
                  افزودن دوره
                </button>
                <button className="list-group-item list-group-item-action bg-dark text-white" onClick={() => setActiveModal("language")}>
                  افزودن زبان
                </button>
                <button className="list-group-item list-group-item-action bg-dark text-white" onClick={() => setActiveModal("updateCourse")}>
                  آپدیت دوره
                </button>
                <button className="list-group-item list-group-item-action bg-dark text-white" onClick={() => setActiveModal("deleteUser")}>
                  حذف کاربر
                </button>
                <button className="list-group-item list-group-item-action bg-danger text-white" onClick={handleAdminLogout}>
                  خروج
                </button>
              </div>
            </aside>

            {/* Content */}
            <main className="col-12 col-md-9 col-lg-10">
              {/* Topbar */}
              <nav className="navbar navbar-light bg-white border-bottom sticky-top">
                <div className="container-fluid">
                  <span className="navbar-brand mb-0 h6">خوش آمدید ادمین 👋</span>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-danger btn-sm" onClick={handleAdminLogout}>
                      خروج
                    </button>
                  </div>
                </div>
              </nav>

              {/* Hero / Quick actions */}
              <section className="container py-4">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="p-4 bg-white rounded-3 border shadow-sm">
                      <h5 className="fw-bold mb-2">مدیریت سیستم</h5>
                      <p className="text-muted mb-0">از میانبرهای زیر استفاده کن تا سریع‌تر کارها رو انجام بدی.</p>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="card shadow-sm h-100">
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title">نمودار دایره‌ای</h6>
                        <div className="chart-container">
                          <Pie data={pieData} className='h-75 w-75 mt-3' />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="card shadow-sm h-100">
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title">نمودار میله‌ای</h6>
                        <div className="chart-container">
                          <Bar data={barData} />
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Quick Action Cards */}
                  <div className="col-6 col-lg-3">
                    <div className="card shadow-sm h-100">
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title">افزودن معلم</h6>
                        <p className="card-text text-muted small mb-3">ثبت معلم جدید و زبان‌های تدریسی</p>
                        <button className="btn btn-primary mt-auto" onClick={() => setActiveModal("teacher")}>باز کردن</button>
                      </div>
                    </div>
                  </div>

                  <div className="col-6 col-lg-3">
                    <div className="card shadow-sm h-100">
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title">افزودن دوره</h6>
                        <p className="card-text text-muted small mb-3">ساخت دوره با زمان‌بندی و سطح</p>
                        <button className="btn btn-primary mt-auto" onClick={() => setActiveModal("course")}>باز کردن</button>
                      </div>
                    </div>
                  </div>

                  <div className="col-6 col-lg-3">
                    <div className="card shadow-sm h-100">
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title">آپدیت دوره</h6>
                        <p className="card-text text-muted small mb-3">ویرایش اطلاعات دوره موجود</p>
                        <button className="btn btn-warning mt-auto" onClick={() => setActiveModal("updateCourse")}>باز کردن</button>
                      </div>
                    </div>
                  </div>

                  <div className="col-6 col-lg-3">
                    <div className="card shadow-sm h-100">
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title">افزودن زبان</h6>
                        <p className="card-text text-muted small mb-3">تعریف زبان جدید برای دوره‌ها</p>
                        <button className="btn btn-secondary mt-auto" onClick={() => setActiveModal("language")}>باز کردن</button>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="card shadow-sm h-100">
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title">حذف کاربر</h6>
                        <p className="card-text text-muted small mb-3">حذف دانشجو با شناسه</p>
                        <button className="btn btn-dark mt-auto" onClick={() => setActiveModal("deleteUser")}>باز کردن</button>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="card shadow-sm h-100">
                      <div className="card-body d-flex flex-column">
                        <h6 className="card-title">مشاهده جزئیات دوره‌ها</h6>
                        <p className="card-text text-muted small mb-3">اگر شناسه دوره را نمی‌دانی، لیست دوره‌ها را ببین</p>
                        <Link to="/detail" className="btn btn-info mt-auto text-white">مشاهده لیست دوره‌ها</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
        <div className="row  container g-1 ms-lg-3 ms-md-4 ms-5 d-flex  ">
          <div className="col col-lg-5 col-10 shadow-sm bg-white border ms-3   ">
            <div className="card-body d-flex flex-column ">
              <h6 className="card-title">مشاهده جزئیات کاربران</h6>
              <p className="card-text text-muted small mb-3">اگر شناسه کاربران را نمی‌دانی، لیست کاربران را ببین</p>
              <Link to="/detailu" className="btn btn-info mt-auto text-white" style={{ backgroundColor: "#F082AC", border: "0.5px solid #F082AC" }}>مشاهده لیست کاربران</Link>
            </div>
          </div>
          <div className="col col-lg-5 col-10 shadow-sm bg-white border ms-lg-5 mt-lg-0 mt-3  ms-3">
            <div className="card-body d-flex flex-column ">
              <h6 className="card-title">مشاهده جزئیات دوره‌ها</h6>
              <p className="card-text text-muted small mb-3">اگر شناسه دوره را نمی‌دانی، لیست دوره‌ها را ببین</p>
              <Link to="/detail" className="btn btn-info mt-auto text-white" style={{
                backgroundColor: "initial", backgroundImage: "linear-gradient(rgba(179, 132, 201, .84), rgba(57, 31, 91, .84) 50%)",
                boxShadow: "rgba(57, 31, 91, 0.24) 0 2px 2px,rgba(179, 132, 201, 0.4) 0 8px 12px", border: "0.5px solid  initial"
              }}>مشاهده لیست دوره‌ها</Link>
            </div>
          </div>

        </div>

        {/* -------------------- Modals (state-driven) -------------------- */}

        {/* Add Language */}
        <div className={`modal fade ${activeModal === "language" ? "show d-block" : ""}`} tabIndex="-1" style={activeModal === "language" ? overlayStyle : {}} aria-hidden={activeModal !== "language"}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">افزودن زبان</h5>
                <button type="button" className="btn-close" onClick={() => setActiveModal(null)}></button>
              </div>
              <form onSubmit={handleLanguageSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">عنوان زبان</label>
                    <input type="text" name="title" value={languageData.title} onChange={handleLanguageChange} className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">توضیحات</label>
                    <input type="text" name="description" value={languageData.description} onChange={handleLanguageChange} className="form-control" required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>بستن</button>
                  <button type="submit" className="btn btn-success">ثبت زبان</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Add Teacher */}
        <div className={`modal fade ${activeModal === "teacher" ? "show d-block" : ""}`} tabIndex="-1" style={activeModal === "teacher" ? overlayStyle : {}} aria-hidden={activeModal !== "teacher"}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">افزودن معلم</h5>
                <button type="button" className="btn-close" onClick={() => setActiveModal(null)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">نام کاربری</label>
                      <input type="text" name="username" value={formData.username} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">ایمیل</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">رمز عبور</label>
                      <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">شماره تلفن</label>
                      <input type="text" name="phonenumber" value={formData.phonenumber} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">کد ملی</label>
                      <input type="text" name="national_code" value={formData.national_code} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">تاریخ تولد</label>
                      <input type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} className="form-control" required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">زبان‌ها (با کاما جدا کن)</label>
                      <input type="text" name="language_titles" value={formData.language_titles} onChange={handleChange} className="form-control" placeholder="مثال: English, German, French" required />
                    </div>
                  </div>

                  {message && <div className="alert alert-info mt-3 mb-0 text-center small">{message}</div>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>بستن</button>
                  <button type="submit" className="btn btn-primary">ثبت معلم</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Add Course */}
        <div className={`modal fade ${activeModal === "course" ? "show d-block" : ""}`} tabIndex="-1" style={activeModal === "course" ? overlayStyle : {}} aria-hidden={activeModal !== "course"}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">افزودن دوره</h5>
                <button type="button" className="btn-close" onClick={() => setActiveModal(null)}></button>
              </div>
              <form onSubmit={handleCourseSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">زبان</label>
                      <input type="text" name="language_title" value={courseData.language_title} onChange={handleCourseChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">نام استاد</label>
                      <input type="text" name="teacher_name" value={courseData.teacher_name} onChange={handleCourseChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">سطح</label>
                      <input type="text" name="level" value={courseData.level} onChange={handleCourseChange} className="form-control" placeholder="A1, B2, ..." required />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">زمان شروع</label>
                      <input type="datetime-local" name="start_time" value={courseData.start_time} onChange={handleCourseChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">زمان پایان</label>
                      <input type="datetime-local" name="end_time" value={courseData.end_time} onChange={handleCourseChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">قیمت</label>
                      <input type="number" name="price" value={courseData.price} onChange={handleCourseChange} className="form-control" min="0" required />
                    </div>
                    <div className="col-12 d-flex gap-4 align-items-center mt-2">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="is_online" id="createIsOnline" checked={courseData.is_online} onChange={handleCourseChange} />
                        <label className="form-check-label" htmlFor="createIsOnline">آنلاین است</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="is_completed" id="createIsCompleted" checked={courseData.is_completed} onChange={handleCourseChange} />
                        <label className="form-check-label" htmlFor="createIsCompleted">تکمیل شده</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>بستن</button>
                  <button type="submit" className="btn btn-success">ثبت دوره</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Update Course */}
        <div className={`modal fade ${activeModal === "updateCourse" ? "show d-block" : ""}`} tabIndex="-1" style={activeModal === "updateCourse" ? overlayStyle : {}} aria-hidden={activeModal !== "updateCourse"}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">آپدیت دوره</h5>
                <button type="button" className="btn-close" onClick={() => setActiveModal(null)}></button>
              </div>
              <form onSubmit={handleUpdateCourseSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">شناسه دوره (ID)</label>
                    <input type="number" name="updateCourseId" value={updateCourseId} onChange={handleUpdateCourseIdChange} className="form-control" required />
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label">زبان</label>
                      <input type="text" name="language_title" value={updateCourseData.language_title} onChange={handleUpdateCourseChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label">نام استاد</label>
                      <input type="text" name="teacher_name" value={updateCourseData.teacher_name} onChange={handleUpdateCourseChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">سطح</label>
                      <input type="text" name="level" value={updateCourseData.level} onChange={handleUpdateCourseChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">زمان شروع</label>
                      <input type="datetime-local" name="start_time" value={updateCourseData.start_time} onChange={handleUpdateCourseChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">زمان پایان</label>
                      <input type="datetime-local" name="end_time" value={updateCourseData.end_time} onChange={handleUpdateCourseChange} className="form-control" required />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">قیمت</label>
                      <input type="number" name="price" value={updateCourseData.price} onChange={handleUpdateCourseChange} className="form-control" required />
                    </div>
                    <div className="col-12 d-flex gap-4 align-items-center mt-2">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="is_online" id="updateIsOnline" checked={updateCourseData.is_online} onChange={handleUpdateCourseChange} />
                        <label className="form-check-label" htmlFor="updateIsOnline">آنلاین است</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="is_completed" id="updateIsCompleted" checked={updateCourseData.is_completed} onChange={handleUpdateCourseChange} />
                        <label className="form-check-label" htmlFor="updateIsCompleted">تکمیل شده</label>
                      </div>
                    </div>
                  </div>

                  <div className="alert alert-info mt-3">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <span className="small mb-0">اگر ایدی کورس را ندارید، می‌توانید از لیست دوره‌ها پیدا کنید.</span>
                      <Link to="/detail" className="btn btn-outline-info btn-sm">مشاهده دوره‌ها</Link>
                    </div>
                  </div>

                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>بستن</button>
                  <button type="submit" className="btn btn-warning">آپدیت دوره</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Delete User */}
        <div className={`modal fade ${activeModal === "deleteUser" ? "show d-block" : ""}`} tabIndex="-1" style={activeModal === "deleteUser" ? overlayStyle : {}} aria-hidden={activeModal !== "deleteUser"}>
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">حذف کاربر</h5>
                <button type="button" className="btn-close" onClick={() => setActiveModal(null)}></button>
              </div>
              <form onSubmit={handleUserSubmit}>
                <div className="modal-body">
                  <label className="form-label">شناسه کاربر (ID)</label>
                  <input
                    type="number"
                    value={UserId}
                    onChange={handleUserId}
                    className="form-control"
                    required
                    min="1"
                  />
                  <div className="alert alert-warning mt-3 mb-0 small">
                    با زدن دکمه حذف، کاربر به صورت دائمی حذف می‌شود. لطفاً دقت کنید.
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setActiveModal(null)}>بستن</button>
                  <button type="submit" className="btn btn-danger">حذف کاربر</button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>

    </>
  );
};

export default Adminpanel;
