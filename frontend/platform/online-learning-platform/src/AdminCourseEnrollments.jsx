import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Stack, Button, TextField, Tooltip
} from "@mui/material";

export default function AdminCourseEnrollments() {
  const { courseId } = useParams();
  const [rows, setRows] = useState([]);
  const [course, setCourse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const rawToken = localStorage.getItem("token");
  const token = rawToken ? rawToken.replace(/^"|"$/g, "") : null; // کوتیشن احتمالی را حذف کن
  const role = (localStorage.getItem("role") || "").toLowerCase();

  useEffect(() => {
    const run = async () => {
      if (!token || role !== "admin") {
        setError("دسترسی فقط برای ادمین‌ها مجاز است.");
        setLoading(false);
        return;
      }
      try {
        // 1) اطلاعات دوره (برای هدر)
        const c = await axios.get(`http://localhost:8000/course/${courseId}`);
        setCourse(c.data);
        console.log("ROLE:", role, "TOKEN(head):", token ? token.slice(0, 20) + "..." : "NULL");

        // 2) لیست ثبت‌نام‌های همین دوره (روت ادمین، پایین بک‌اندشو می‌دم)
        const res = await axios.get(`http://localhost:8000/enrollments/by-course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        setRows(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        const msg = err?.response?.data?.detail || "خطا در دریافت اطلاعات.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [courseId, token, role]);

  const paidCount = useMemo(() => rows.filter(r => (r.status || r.enrollment_status) === "paid").length, [rows]);

  if (loading) return <Box p={3}>در حال بارگذاری...</Box>;
  if (error) return <Box p={3} sx={{ color: "red" }}>{error}</Box>;

  return (
    <Box p={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={800}>
          جزئیات ثبت‌نام‌های دوره #{courseId}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button component={Link} to="/adminpanel" variant="outlined">بازگشت به پنل</Button>
        </Stack>
      </Stack>

      {course && (
        <Paper sx={{ p:2, mb:2 }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Typography><b>زبان:</b> {course.language_title}</Typography>
            <Typography><b>استاد:</b> {course.teacher_name}</Typography>
            <Typography><b>سطح:</b> {course.level}</Typography>
            <Typography><b>آنلاین:</b> {course.is_online ? "بله" : "خیر"}</Typography>
            <Typography><b>قیمت:</b> {course.price}</Typography>
            <Typography><b>زمان شروع:</b> {new Date(course.start_time).toLocaleString("fa-IR")}</Typography>
            <Typography><b>زمان پایان:</b> {new Date(course.end_time).toLocaleString("fa-IR")}</Typography>
          </Stack>
        </Paper>
      )}

      <Paper sx={{ p:2, mb:2 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          <Chip label={`تعداد کل ثبت‌نام‌ها: ${rows.length}`} />
          <Chip color="success" label={`پرداخت شده: ${paidCount}`} />
          <Chip color="warning" label={`در انتظار پرداخت: ${rows.length - paidCount}`} />
        </Stack>
      </Paper>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>کاربر</TableCell>
              <TableCell>ایمیل</TableCell>
              <TableCell>تلفن</TableCell>
              <TableCell>کد ملی</TableCell>
              <TableCell>تاریخ ثبت‌نام</TableCell>
              <TableCell>وضعیت پرداخت</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, i) => {
              // شکل داده: طبق روت پیشنهادی، student داخل هر ردیف هست
              const st = r.student || {};
              const status = r.status || r.enrollment_status; // paid/pending
              return (
                <TableRow key={r.id || i}>
                  <TableCell>{st.username || st.name || "-"}</TableCell>
                  <TableCell>{st.email || "-"}</TableCell>
                  <TableCell>{st.phonenumber || "-"}</TableCell>
                  <TableCell>{st.national_code ?? "-"}</TableCell>
                  <TableCell>{r.date ? new Date(r.date).toLocaleDateString("fa-IR") : "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={status === "paid" ? "پرداخت شده" : "در انتظار پرداخت"}
                      color={status === "paid" ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center">موردی یافت نشد.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
