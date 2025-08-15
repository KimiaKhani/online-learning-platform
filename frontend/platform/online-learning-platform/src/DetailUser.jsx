import axios from "axios";
import React, { useEffect, useState } from "react";

const DetailUser = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchStudents = async () => {
      // اگر نیاز به محدودیت ادمین دارید این دو خط را نگه دارید
      if (!token) {
        setError("توکن موجود نیست. لطفاً وارد شوید.");
        setLoading(false);
        return;
      }
      if (role !== "admin") {
        setError("شما دسترسی به این صفحه ندارید.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/student/students", {
          headers: {
            Authorization: `Bearer ${token}`, // اگر API احراز هویت نمی‌خواهد، این هدر را حذف کنید
            Accept: "application/json",
          },
        });
        setStudents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.status === 401
            ? "دسترسی غیرمجاز (401)."
            : "مشکلی در دریافت اطلاعات پیش آمد."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token, role]);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div style={{ color: "red", padding: 20 }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>لیست دانش‌آموزان</h2>
      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>نام کاربری</th>
            <th>ایمیل</th>
            <th>کد ملی</th>
            <th>تاریخ تولد</th>
            <th>شماره تماس</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, idx) => (
            <tr key={s.username ?? idx}>
              <td>{s.username}</td>
              <td>{s.email}</td>
              <td>{s.national_code}</td>
              <td>{s.birthdate}</td>
              <td>{s.phonenumber}</td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                موردی یافت نشد.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DetailUser;
