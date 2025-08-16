// CourseSessions.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";

const API = "http://localhost:8000";

const authHeader = () => {
  const token = (localStorage.getItem("token") || "").replace(/^"(.*)"$/, "$1");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function CourseSessions() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      setErr("");

      try {
        // اطلاعات دوره (اختیاری برای هدر)
        try {
          const c = await axios.get(`${API}/course/${courseId}`, { headers: authHeader() });
          if (!cancel) setCourse(c.data);
        } catch {
          /* ignore */
        }

        // لیست ویدیوها
        const r = await axios.get(`${API}/videos/${courseId}`, { headers: authHeader() });
        if (!cancel) setRows(Array.isArray(r.data) ? r.data : []);
      } catch (e) {
        if (!cancel) setErr(e?.response?.data?.detail || "خطا در دریافت جلسات.");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();

    return () => { cancel = true; };
  }, [courseId]);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">جلسات دوره #{courseId}</h4>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
            بازگشت
          </button>
          <Link to="/userpanel" className="btn btn-outline-dark btn-sm">پنل کاربری</Link>
        </div>
      </div>

      {course && (
        <div className="alert alert-secondary">
          <div><b>زبان:</b> {course.language_title}</div>
          <div><b>استاد:</b> {course.teacher_name}</div>
          <div><b>سطح:</b> {course.level}</div>
          <div><b>وضعیت:</b> {course.is_online ? "آنلاین" : "آفلاین"}</div>
        </div>
      )}

      {loading ? (
        <div>در حال بارگذاری…</div>
      ) : err ? (
        <div className="alert alert-danger">{err}</div>
      ) : rows.length === 0 ? (
        <div className="alert alert-info">جلسه‌ای ثبت نشده است.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>عنوان</th>
                <th>توضیح</th>
                <th>ویدیو</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v, idx) => (
                <tr key={v.id || idx}>
                  <td>{idx + 1}</td>
                  <td>{v.title || "—"}</td>
                  <td>{v.description || v.desc || "—"}</td>
                  <td>
                    {v.url ? (
                      <a href={v.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                        مشاهده
                      </a>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
