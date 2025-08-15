// TeacherPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

// هدر احراز هویت
const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// helper: error -> string (برای جلوگیری از رندر آبجکت داخل JSX)
const toMessage = (err) => {
  const data = err?.response?.data;
  if (typeof data === "string") return data;
  const detail = data?.detail || data?.message;
  if (typeof detail === "string") return detail;
  if (Array.isArray(data)) return JSON.stringify(data);
  if (data?.msg) return data.msg;
  return err?.message || "خطای نامشخص";
};

const Pill = ({ active, onClick, children }) => (
  <button
    className={`btn btn-sm ${active ? "btn-primary" : "btn-outline-primary"}`}
    onClick={onClick}
    type="button"
  >
    {children}
  </button>
);

const Row = ({ label, children }) => (
  <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
    <span className="text-muted">{label}</span>
    <div className="ms-3">{children}</div>
  </div>
);

const TeacherPanel = () => {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "teacher";

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all"); // all | online | offline

  const [profile, setProfile] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [activeCourse, setActiveCourse] = useState(null);

  const [meetLink, setMeetLink] = useState("");
  const [meetStatus, setMeetStatus] = useState({ type: "", msg: "" });
  const [workingMeet, setWorkingMeet] = useState(false);

  // خروج
  const handleLogout = () => {
    ["token", "role", "username", "userID"].forEach((k) =>
      localStorage.removeItem(k)
    );
    window.location.href = "/";
  };

  // لود کورس‌ها و پروفایل
  useEffect(() => {
    if (role !== "teacher") return;

    const run = async () => {
      setLoading(true);
      try {
        const [cRes, pRes] = await Promise.all([
          axios.get(`${API_BASE}/teacher/my_courses`, { headers: authHeaders() }),
          axios.get(`${API_BASE}/teacher/profile`, { headers: authHeaders() }),
        ]);
        setCourses(cRes.data || []);
        setProfile(pRes.data || null);
      } catch (e) {
        // نمونه برای تست UI
        setCourses([
          {
            id: 1,
            language_title: "English",
            teacher_name: username,
            is_online: true,
            level: "B1",
            price: 500000,
          },
          {
            id: 2,
            language_title: "German",
            teacher_name: username,
            is_online: false,
            level: "A2",
            price: 450000,
          },
        ]);
        setProfile({
          id: 0,
          username,
          email: "",
          phonenumber: "",
          national_code: "",
          birthdate: "",
          description: "",
          languages: [],
        });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [role, username]);

  // لود دانشجوها (کلِ دانشجوهای کورس‌های معلم)
  useEffect(() => {
    if (role !== "teacher") return;
    const run = async () => {
      setLoadingStudents(true);
      try {
        const r = await axios.get(`${API_BASE}/teacher/enrolled_students`, {
          headers: authHeaders(),
        });
        setStudents(r.data || []);
      } catch (e) {
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };
    run();
  }, [role]);

  const filteredCourses = useMemo(() => {
    if (filter === "online") return courses.filter((c) => c.is_online);
    if (filter === "offline") return courses.filter((c) => !c.is_online);
    return courses;
  }, [courses, filter]);

  /** ---------- مدیریت لینک کلاس آنلاین ---------- */
  useEffect(() => {
    if (profile) {
      console.log("Teacher ID:", profile.id);
    }
  }, [profile]);

  // طبق صحبت: فعلاً پرفچ GET لینک را حذف می‌کنیم (بک‌اند GET برای معلم ندارد)
  const openCourseLive = (course) => {
    setActiveCourse(course);
    setMeetStatus({ type: "", msg: "" });
    setMeetLink("");
  };

  // هلسپر: گرفتن آیدی معلم از پروفایل
const getTeacherId = () => {
    const id = Number(profile?.id);
    return Number.isFinite(id) && id > 0 ? id : null;
  };
  
  const saveMeetLink = async () => {
    if (!activeCourse) return;
  
    if (!meetLink) {
      setMeetStatus({ type: "danger", msg: "لطفاً لینک را وارد کنید." });
      return;
    }
  
    const teacherId = getTeacherId();
    if (!teacherId) {
      setMeetStatus({
        type: "danger",
        msg: "شناسه کاربر نامعتبر است. ابتدا پروفایل بارگذاری شود یا دوباره وارد شوید.",
      });
      return;
    }
  
    setWorkingMeet(true);
    setMeetStatus({ type: "", msg: "" });
  
    try {
      await axios.post(
        `${API_BASE}/course/course/${activeCourse.id}/add-meet-link`,
        null,
        {
          headers: authHeaders(),
          params: {
            meet_link: meetLink,
            teacher_id: teacherId,
          },
          // اگر احراز هویت‌تون کوکی‌محوره، این رو آنکامنت کنید:
          // withCredentials: true,
        }
      );
  
      setMeetStatus({
        type: "success",
        msg: "لینک با موفقیت ثبت/به‌روزرسانی شد.",
      });
    } catch (err) {
      setMeetStatus({ type: "danger", msg: toMessage(err) });
    } finally {
      setWorkingMeet(false);
    }
  };
  
  const deleteMeetLink = async () => {
    if (!activeCourse) return;
  
    const teacherId = getTeacherId();
    if (!teacherId) {
      setMeetStatus({
        type: "danger",
        msg: "شناسه کاربر نامعتبر است. ابتدا پروفایل بارگذاری شود یا دوباره وارد شوید.",
      });
      return;
    }
  
    setWorkingMeet(true);
    setMeetStatus({ type: "", msg: "" });
  
    try {
      await axios.delete(
        `${API_BASE}/course/course/${activeCourse.id}/remove-meet-link`,
        {
          headers: authHeaders(),
          params: { teacher_id: teacherId },
          // اگر احراز هویت‌تون کوکی‌محوره:
          // withCredentials: true,
        }
      );
  
      setMeetLink("");
      setMeetStatus({ type: "success", msg: "لینک حذف شد." });
    } catch (err) {
      setMeetStatus({ type: "danger", msg: toMessage(err) });
    } finally {
      setWorkingMeet(false);
    }
  };
  
  /** ---------- پروفایل ---------- */
  const onSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setSavingProfile(true);
    try {
      await axios.put(`${API_BASE}/teacher/update_info`, profile, {
        headers: { ...authHeaders(), "Content-Type": "application/json" },
      });
      alert("اطلاعات با موفقیت ذخیره شد.");
    } catch (err) {
      alert(toMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  if (role !== "teacher") {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">دسترسی فقط برای نقش «معلم» است.</div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
        <div>
          <h3 className="mb-1">پنل معلم</h3>
          <div className="text-muted">سلام، {username}</div>
        </div>
        <div className="d-flex gap-2 mt-3 mt-md-0">
          <Pill active={filter === "all"} onClick={() => setFilter("all")}>
            همهٔ کورس‌ها
          </Pill>
          <Pill active={filter === "online"} onClick={() => setFilter("online")}>
            آنلاین
          </Pill>
          <Pill
            active={filter === "offline"}
            onClick={() => setFilter("offline")}
          >
            آفلاین
          </Pill>

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleLogout}
            type="button"
          >
            خروج
          </button>
        </div>
      </div>

      {/* Courses */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="card-title mb-0">کورس‌های من</h5>
            {loading && <div className="spinner-border spinner-border-sm" />}
          </div>

          {!filteredCourses.length ? (
            <div className="text-muted py-4">هیچ کلاسی یافت نشد.</div>
          ) : (
            <div className="row mt-3 g-3">
              {filteredCourses.map((c) => (
                <div className="col-12 col-md-6 col-lg-4" key={c.id}>
                  <div className="border rounded p-3 h-100 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>{c.language_title}</strong>
                      <span
                        className={`badge ${
                          c.is_online ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {c.is_online ? "آنلاین" : "آفلاین"}
                      </span>
                    </div>
                    <div className="small text-muted mt-1">
                      سطح: {c.level} • قیمت:{" "}
                      {Number(c.price || 0).toLocaleString()} تومان
                    </div>

                    <div className="mt-auto pt-3 d-flex gap-2">
                      {c.is_online && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => openCourseLive(c)}
                          data-bs-toggle="modal"
                          data-bs-target="#liveModal"
                          type="button"
                        >
                          لینک کلاس آنلاین
                        </button>
                      )}
                      <button
                        className="btn btn-outline-dark btn-sm"
                        data-bs-toggle="modal"
                        data-bs-target="#studentsModal"
                        onClick={() => setActiveCourse(c)}
                        type="button"
                      >
                        دانشجویان ثبت‌نام‌شده
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-3">پروفایل</h5>
          {!profile ? (
            <div className="text-muted">در حال بارگذاری…</div>
          ) : (
            <form onSubmit={onSaveProfile} className="row g-3">
              <div className="col-md-4">
                <label className="form-label">نام کاربری</label>
                <input
                  className="form-control"
                  value={profile.username || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, username: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">ایمیل</label>
                <input
                  type="email"
                  className="form-control"
                  value={profile.email || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">شماره تماس</label>
                <input
                  className="form-control"
                  value={profile.phonenumber || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, phonenumber: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <label className="form-label">درباره من</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={profile.description || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, description: e.target.value })
                  }
                />
              </div>
              <div className="col-12 d-flex gap-2">
                <button className="btn btn-primary" disabled={savingProfile}>
                  {savingProfile ? "در حال ذخیره…" : "ذخیره تغییرات"}
                </button>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={async () => {
                    try {
                      const r = await axios.get(`${API_BASE}/teacher/profile`, {
                        headers: authHeaders(),
                      });
                      setProfile(r.data || profile);
                    } catch {
                      /* ignore */
                    }
                  }}
                >
                  بازخوانی از سرور
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal: Live Link */}
      <div className="modal fade" id="liveModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title">
                لینک کلاس آنلاین • {activeCourse?.language_title || ""}
              </h6>
              <button className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              {activeCourse?.is_online ? (
                <>
                  <Row label="کد کورس">
                    <code>#{activeCourse?.id}</code>
                  </Row>

                  <div className="mt-3">
                    <label className="form-label">آدرس جلسه (Meet/Zoom/…)</label>
                    <input
                      className="form-control"
                      type="url"
                      placeholder="https://..."
                      value={meetLink}
                      onChange={(e) => setMeetLink(e.target.value)}
                    />
                    {meetStatus.msg && (
                      <div
                        className={`small mt-2 text-${
                          meetStatus.type === "danger"
                            ? "danger"
                            : meetStatus.type === "success"
                            ? "success"
                            : "muted"
                        }`}
                      >
                        {String(meetStatus.msg)}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-muted">این کورس آفلاین است.</div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" data-bs-dismiss="modal">
                بستن
              </button>
              {activeCourse?.is_online && (
                <>
                  <button className="btn btn-outline-danger" onClick={deleteMeetLink} disabled={workingMeet}>
                    حذف لینک
                  </button>
                  <button className="btn btn-primary" onClick={saveMeetLink} disabled={workingMeet}>
                    {workingMeet ? "در حال ذخیره…" : "ذخیره"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Students */}
      <div className="modal fade" id="studentsModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title">
                دانشجویان ثبت‌نام‌شده {activeCourse ? `• ${activeCourse.language_title}` : ""}
              </h6>
              <button className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              {loadingStudents ? (
                <div className="d-flex align-items-center">
                  <div className="spinner-border me-2" />
                  <span>در حال بارگذاری…</span>
                </div>
              ) : !students.length ? (
                <div className="text-muted">دانشجویی یافت نشد.</div>
              ) : (
                <>
                  <div className="alert alert-secondary small">
                    توجه: طبق بک‌اند فعلی، این لیست <strong>کل دانشجوهای تمام کورس‌های شما</strong>ست.
                    برای نمایش دقیق «به ازای هر کورس»، یک API مثل
                    <code> /teacher/courses/{`{course_id}`}/students </code> لازم است.
                  </div>
                  <div className="table-responsive">
                    <table className="table table-sm align-middle">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>نام کاربری</th>
                          <th>ایمیل</th>
                          <th>تلفن</th>
                          <th>کد ملی</th>
                          <th>تاریخ تولد</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((s, idx) => (
                          <tr key={s.id || idx}>
                            <td>{idx + 1}</td>
                            <td>{s.username}</td>
                            <td>{s.email}</td>
                            <td>{s.phonenumber}</td>
                            <td>{s.national_code}</td>
                            <td>{s.birthdate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline-secondary" data-bs-dismiss="modal">
                بستن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPanel;
