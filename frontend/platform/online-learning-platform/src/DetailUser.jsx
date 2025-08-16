import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";

const DetailUser = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // توکن تمیز (اگر با کوتیشن ذخیره شده باشد)
  const rawToken = localStorage.getItem("token");
  const token = rawToken ? rawToken.replace(/^"|"$/g, "") : null;
  const role = (localStorage.getItem("role") || "").toLowerCase();

  useEffect(() => {
    const fetchStudents = async () => {
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
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError(
          err?.response?.status === 401
            ? "دسترسی غیرمجاز (401)."
            : (err?.response?.data?.detail || "مشکلی در دریافت اطلاعات پیش آمد.")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [token, role]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) => {
      const username = (s.username || "").toLowerCase();
      const email = (s.email || "").toLowerCase();
      const phone = (s.phonenumber || "").toLowerCase();
      const nat = String(s.national_code ?? "");
      return (
        username.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        nat.includes(q)
      );
    });
  }, [students, query]);

  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("fa-IR") : "-");

  if (loading)
    return (
      <Box p={3} display="flex" alignItems="center" gap={1}>
        <CircularProgress size={20} />
        در حال بارگذاری...
      </Box>
    );

  if (error)
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <Box p={3}>
      {/* هدر صفحه */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h5" fontWeight={800}>
          لیست دانش‌آموزان
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button component={Link} to="/adminpanel" variant="outlined">
            بازگشت به پنل
          </Button>
        </Stack>
      </Stack>

      {/* خلاصه + جستجو */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Chip label={`تعداد کل: ${students.length}`} />
            <Chip color="info" label={`نتیجه جستجو: ${filtered.length}`} />
          </Stack>
          <TextField
            size="small"
            label="جستجو"
            placeholder="نام کاربری، ایمیل، تلفن یا کد ملی"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ minWidth: 260 }}
          />
        </Stack>
      </Paper>

      {/* جدول کاربران */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>نام کاربری</TableCell>
              <TableCell>ایمیل</TableCell>
              <TableCell>کد ملی</TableCell>
              <TableCell>تاریخ تولد</TableCell>
              <TableCell>شماره تماس</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((s, idx) => (
              <TableRow key={s.id ?? s.username ?? idx}>
                <TableCell>{s.username || "-"}</TableCell>
                <TableCell>{s.email || "-"}</TableCell>
                <TableCell>{s.national_code ?? "-"}</TableCell>
                <TableCell>{fmtDate(s.birthdate)}</TableCell>
                <TableCell>{s.phonenumber || "-"}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  موردی یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DetailUser;
