import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Header from './Header';
import image from "./ChatGPT Image Jul 28, 2025, 12_34_49 AM.png";
import Footer from './Footer';
import "./userpanel.css";
import axios from 'axios';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const API = "http://localhost:8000";

const Userpanel = () => {
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // پروفایل + شناسه دانشجو
  const [profile, setProfile] = useState({});
  const [studentId, setStudentId] = useState(null);

  // ثبت‌نام‌ها و لینک‌های کلاس
  const [enrollments, setEnrollments] = useState([]);
  const [classLinks, setClassLinks] = useState({}); // { [courseId]: string | null }

  // فرم ویرایش
  const [form, setForm] = useState({
    username: "",
    phonenumber: "",
    email: "",
    password: "",
    national_code: "",
    birthdate: ""
  });
  useEffect(() => {
    const getStudentId = async () => {
      try {
        const res = await axios.get(`${API}/student/me`, { headers: authHeader() });
        console.log("Student me:", res.data);
        setStudentId(res.data.id);
      } catch (e) {
        console.error(e);
      }
    };
    getStudentId();
  }, []);

  const authHeader = () => {
    const token = (localStorage.getItem("token") || "").replace(/^"(.*)"$/, "$1");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    window.location.reload();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await axios.put(
        `${API}/student/update_info`,
        {
          username: form.username || undefined,
          phonenumber: form.phonenumber || undefined,
          email: form.email || undefined,
          password: form.password || undefined,
          national_code: form.national_code === "" ? undefined : Number(form.national_code),
          birthdate: form.birthdate || undefined,
        },
        { headers: { ...authHeader(), Accept: "application/json", "Content-Type": "application/json" } }
      );

      alert("تغییرات با موفقیت ذخیره شد.");

      const changedPassword = !!form.password;
      const changedUsername = form.username && form.username !== profile.username;
      if (changedPassword || changedUsername) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/");
        window.location.reload();
        return;
      }

      setProfile((prev) => ({
        ...prev,
        username: form.username || prev.username,
        phonenumber: form.phonenumber || prev.phonenumber,
        email: form.email || prev.email,
        national_code: form.national_code || prev.national_code,
        birthdate: form.birthdate || prev.birthdate,
      }));
      window.dispatchEvent(new Event("user:profile-updated"));
    } catch (err) {
      const status = err?.response?.status;
      setMsg(status === 401 ? "دسترسی غیرمجاز (401)." : "در ذخیره تغییرات خطایی رخ داد.");
    } finally {
      setLoading(false);
    }
  };

  // 1) پروفایل (برای student_id)
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) return;

    (async () => {
      try {
        const profilePath =
          role === "admin" ? "admin/profile" :
          role === "teacher" ? "teacher/profile" :
          "student/profile";

        const res = await axios.get(`${API}/${profilePath}`, { headers: authHeader() });
        console.log("Profile:", res.data);
        setProfile(res.data || {});
        if (role === "student" && res.data?.id) {
          setStudentId(Number(res.data.id));
        }
      } catch (e) {
        console.error("Profile error:", e);
      }
    })();
  }, []);

  // 2) ثبت‌نام‌های من
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API}/enrollments/me`, { headers: authHeader() });
        console.log("Enrollments:", res.data);
        setEnrollments(res.data || []);
      } catch (e) {
        console.error("Enrollments error:", e);
        setEnrollments([]);
      }
    })();
  }, []);

  // 3) لینک هر دوره (Swagger: student_id لازم است)
  useEffect(() => {
    if (!studentId || !enrollments.length) return;

    let cancelled = false;
    (async () => {
      try {
        const tasks = enrollments.map((enr) => {
          // courseId را مطمئن از enr.course.id یا enr.course_id بگیر
          const courseId = enr?.course?.id ?? enr?.course_id;
          if (!courseId) return Promise.resolve([null, null]);

          return axios.get(
            `${API}/course/course/${courseId}/meet-link`,
            { headers: authHeader(), params: { student_id: studentId } }
          )
          .then(r => {
            const body = r.data;
            const link = typeof body === "string" ? body : (body?.google_meet_link ?? body?.link ?? null);
            console.log("Link for course", courseId, "→", link);
            return [courseId, link];
          })
          .catch(err => {
            console.warn(`No link for course ${courseId}`, err?.response?.status, err?.response?.data);
            return [courseId, null];
          });
        });

        const pairs = await Promise.all(tasks);
        if (cancelled) return;

        const next = {};
        for (const [cid, link] of pairs) if (cid) next[cid] = link;
        setClassLinks(next);
      } catch (e) {
        console.error("fetchLinks error:", e);
      }
    })();

    return () => { cancelled = true; };
  }, [studentId, enrollments]);

  const fmt = (d) => {
    if (!d) return "—";
    try {
      const date = new Date(d);
      return Number.isNaN(date.getTime()) ? String(d) : date.toLocaleDateString("fa-IR");
    } catch { return String(d); }
  };

  return (
    <>
      <Header />
      <div className="">
        <div className="bgbg" style={{ backgroundColor: "rgb(63, 56, 45)", position: "relative" }}>
          <img
            src={image}
            alt="تصویر اصلی"
            className="w-100 h-25 mt-5"
            style={{ objectFit: "inherit", filter: "brightness(50%)", boxShadow: "0 10px 40px rgba(0,0,0,.7)" }}
          />
          <div className="overlay-logo-text">
            <img
              src="https://logoyab.com/wp-content/uploads/2024/08/Noshirvani-University-of-Technology-Logo-1030x1030.png"
              alt="لوگو"
              className="small-logo"
            />
            <p className="logo-text ms-5">موسسه زبان نوشیروانی بابل</p>
          </div>
        </div>
      </div>

      <div className="container srt ms d-flex justify-content-between">
        <div className="panel mt-4 p-5">
          <NavLink to="/my-classes" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
            کلاس های من
          </NavLink>
          <NavLink to="/my-certificates" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
            گواهی های من
          </NavLink>
          <NavLink to="/profile-settings" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
            تنظیمات پروفایل
          </NavLink>
          <NavLink to="/courses" className={({ isActive }) => (isActive ? "nav-link active-link" : "nav-link")}>
            دوره ها
          </NavLink>
          <button type="button" style={{ border: "none" }} className="nav-link" onClick={() => setIsEditOpen(true)}>
            تغییرات اطلاعات حساب کاربری
          </button>
          <button style={{ border: "none" }} className="nav-link" onClick={handleLogout}>
            خروج
          </button>
        </div>

        <div style={{ flex: 1 }} className="ms-5">
          <h4 className="mt-4">دوره‌های ثبت‌نام شده</h4>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>زبان</th>
                <th>سطح</th>
                <th>مدرس</th>
                <th>تاریخ شروع / پایان</th>
                <th>لینک کلاس آنلاین</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.length ? (
                enrollments.map((enr) => {
                  const course = enr.course || {};
                  const courseId = course.id ?? enr.course_id;
                  const link = classLinks[courseId];
                  return (
                    <tr key={enr.id}>
                      <td>{course.language_title ?? "—"}</td>
                      <td>{course.level ?? "—"}</td>
                      <td>{course.teacher_name ?? "—"}</td>
                      <td>{fmt(course.start_time)} / {fmt(course.end_time)}</td>
                      <td>
                        {link ? (
                          <a href={link} target="_blank" rel="noopener noreferrer">ورود به کلاس</a>
                        ) : "—"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">هیچ دوره‌ای ثبت‌نام نکردید.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isEditOpen}
        onRequestClose={() => setIsEditOpen(false)}
        style={{
          overlay: { backgroundColor: 'rgba(0,0,0,.7)', zIndex: 1000 },
          content: { zIndex: 1001, maxWidth: 400, margin: 'auto', padding: 10, borderRadius: 10, backgroundColor: '#ECF0F1' }
        }}
      >
        <h4 style={{ marginBottom: 12 }}>ویرایش اطلاعات حساب</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label>نام کاربری</label>
            <input name="username" value={form.username} onChange={handleChange} className="form-control" placeholder={profile.username} autoComplete="username" />
          </div>
          <div className="mb-2">
            <label>ایمیل</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="form-control" placeholder={profile.email} autoComplete="email" />
          </div>
          <div className="mb-2">
            <label>رمز عبور جدید</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" placeholder={String(profile.password ?? "")} autoComplete="new-password" />
          </div>
          <div className="mb-2">
            <label>کد ملی</label>
            <input type="number" name="national_code" value={form.national_code} onChange={handleChange} className="form-control" placeholder={String(profile.national_code ?? "")} />
          </div>
          <div className="mb-2">
            <label>شماره تماس</label>
            <input name="phonenumber" value={form.phonenumber} onChange={handleChange} className="form-control" placeholder={String(profile.phonenumber ?? "")} autoComplete="tel" />
          </div>
          <div className="mb-3">
            <label>تاریخ تولد</label>
            <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} className="form-control" />
          </div>

          {msg && <div style={{ color: msg.includes("موفق") ? "green" : "red", marginBottom: 8 }}>{msg}</div>}

          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? "در حال ارسال..." : "ثبت تغییرات"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEditOpen(false)} style={{ flex: 1 }}>
              بستن
            </button>
          </div>
          <p style={{ color: "#777", fontSize: 21, fontWeight: "bold" }} className="mt-4">
            اطلاعات قبلی شما در باکس مربوط به خود قرار گرفته است
          </p>
        </form>
      </Modal>

      <Footer />
    </>
  );
};

export default Userpanel;
