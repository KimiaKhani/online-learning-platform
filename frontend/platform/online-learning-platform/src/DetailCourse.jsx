import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DetailCourse = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) {
        setError("توکن موجود نیست. لطفاً وارد شوید.");
        return;
      }

      if (role !== "admin") {
        setError("شما دسترسی به این صفحه ندارید.");
        return;
      }

      setIsAdmin(true);

      try {
        const coursesRes = await axios.get("http://localhost:8000/course/courses", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCourses(coursesRes.data);
      } catch (err) {
        setError("مشکلی در دریافت اطلاعات پیش آمد.");
        console.error(err);
      }
    };

    fetchCourses();
  }, [token, role]);

  if (error) return <div style={{ color: "red", padding: "20px" }}>{error}</div>;

  if (!isAdmin) return <div>در حال بررسی دسترسی...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>لیست دوره‌ها</h2>
      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>شناسه</th>
            <th>عنوان</th>
            <th>معلم</th>
            <th>زبان</th>
            <th>توضیحات</th>
            <th>تاریخ شروع</th>
            <th>لینک</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course.id}>
              <td>{course.id}</td>
              <td>{course.level}</td>
              <td>{course.teacher_name}</td>
              <td>{course.language_title}</td>
              <td>{course.description}</td>
              <td>{course.start_time}</td>
              <td>{course.link}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetailCourse;
