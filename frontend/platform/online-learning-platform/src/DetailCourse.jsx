import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Stack, Button
} from "@mui/material";

const DetailCourse = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // اگر احتمالاً با کوتیشن ذخیره شده بود، تمیزش کنیم
  const rawToken = localStorage.getItem("token");
  const token = rawToken ? rawToken.replace(/^"|"$/g, "") : null;
  const role = (localStorage.getItem("role") || "").toLowerCase();

  useEffect(() => {
    const fetchCourses = async () => {
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

      setIsAdmin(true);
      try {
        // توجه: /course/courses در بک‌اندت احراز هویت نمی‌خواهد،
        // ولی اگر خواستی می‌توانی هدر را نگه داری.
        const coursesRes = await axios.get("http://localhost:8000/course/courses", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.detail || "مشکلی در دریافت اطلاعات پیش آمد.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, role]);

  if (loading) return <Box p={3}>در حال بارگذاری...</Box>;
  if (error) return <div style={{ color: "red", padding: "20px" }}>{error}</div>;
  if (!isAdmin) return <div>در حال بررسی دسترسی...</div>;

  const fmt = (d) => (d ? new Date(d).toLocaleString("fa-IR") : "-");

  return (
    <Box p={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={800}>جزئیات دوره‌ها</Typography>
        <Stack direction="row" spacing={1}>
          <Button component={Link} to="/adminpanel" variant="outlined">بازگشت به پنل</Button>
        </Stack>
      </Stack>

      <Paper sx={{ p:2, mb:2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Chip label={`تعداد کل دوره‌ها: ${courses.length}`} />
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>شناسه</TableCell>
              <TableCell>زبان</TableCell>
              <TableCell>استاد</TableCell>
              <TableCell>سطح</TableCell>
              <TableCell>آنلاین؟</TableCell>
              <TableCell>تکمیل؟</TableCell>
              <TableCell>قیمت</TableCell>
              <TableCell>شروع</TableCell>
              <TableCell>پایان</TableCell>
              <TableCell>لینک</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.language_title || "-"}</TableCell>
                <TableCell>{c.teacher_name || "-"}</TableCell>
                <TableCell>{c.level || "-"}</TableCell>
                <TableCell>
                  <Chip size="small" label={c.is_online ? "بله" : "خیر"} color={c.is_online ? "success" : "default"} />
                </TableCell>
                <TableCell>
                  <Chip size="small" label={c.is_completed ? "بله" : "خیر"} color={c.is_completed ? "default" : "warning"} />
                </TableCell>
                <TableCell>{c.price ?? "-"}</TableCell>
                <TableCell>{fmt(c.start_time)}</TableCell>
                <TableCell>{fmt(c.end_time)}</TableCell>
                <TableCell style={{ maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.link ? <a href={c.link} target="_blank" rel="noreferrer">مشاهده</a> : "—"}
                </TableCell>
              </TableRow>
            ))}
            {courses.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">موردی یافت نشد.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DetailCourse;
