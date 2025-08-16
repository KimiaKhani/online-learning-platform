import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./amin.css"
// ===== MUI =====
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Paper,
  Divider,
  Stack,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  GlobalStyles,
  Alert,
  Tooltip,
  useMediaQuery
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import LanguageIcon from "@mui/icons-material/Language";

// ===== Charts =====
import { Line, Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto"; // auto-registers

const drawerWidth = 240;

/** کارت گلس با افکت‌های ظریف */
function GlassPaper({ children, sx, ...rest }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.16)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 16px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
}
function SidebarList() {
  const items = [
    { icon: <HomeIcon />, label: "داشبورد" },
    { icon: <AssessmentIcon />, label: "گزارش‌ها" },
    { icon: <PeopleIcon />, label: "کاربران" },
    { icon: <SchoolIcon />, label: "اساتید" },
    { icon: <ClassIcon />, label: "کلاس‌ها" },
    { icon: <SettingsIcon />, label: "تنظیمات" },
  ];
  return (
    <List>
      {items.map((it, idx) => (
        <ListItemButton key={idx} sx={{ borderRadius: 2, mb: 0.5 }}>
          <ListItemIcon sx={{ minWidth: 40, color: "rgba(255,255,255,0.9)" }}>
            {it.icon}
          </ListItemIcon>
          <ListItemText
            primary={it.label}
            primaryTypographyProps={{ fontSize: 14 }}
          />
        </ListItemButton>
      ))}
    </List>
  );
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: "#e7e9ee" } } },
  scales: {
    x: { ticks: { color: "#e7e9ee" }, grid: { color: "rgba(255,255,255,0.08)" } },
    y: { ticks: { color: "#e7e9ee" }, grid: { color: "rgba(255,255,255,0.08)" } },
  },
  animation: { duration: 250 }
};

/** === کامپوننت اصلی: پنل مدیریت گلس ===
 * اسکلت و استایل از نسخه گلس خودمونه، اما تمام اکشن‌ها و APIها همون‌هایی هست
 * که در کد اولیه‌ات داشتی (افزودن معلم/دوره/زبان، آپدیت دوره، حذف کاربر، آمار و چارت‌ها).
 */
export default function GlamAdminPanel({ rtl = true }) {
  const navigate = useNavigate();
  const isSm = useMediaQuery("(max-width:600px)");

  // ======= Data state (مثل کد خودت) =======
  const [stats, setStats] = useState([
    { label: "زبان‌آموز", count: 0 },
    { label: "تعداد استاد", count: 0 },
    { label: "تعداد کلاس", count: 0 },
  ]);


  const [courses, setCourses] = useState([]); // همان data11

  // UI State
  const [activeModal, setActiveModal] = useState(null); // 'teacher' | 'course' | 'language' | 'updateCourse' | 'deleteUser' | null
  const [message, setMessage] = useState("");

  // Drawer state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const handleDrawerToggle = () => {
    if (isSm) setMobileOpen((v) => !v);
    else setDrawerOpen((v) => !v);
  };

// ====== Enrollment details modal state ======
const [enrollCourseId, setEnrollCourseId] = useState("");
const [enrollAdminId, setEnrollAdminId] = useState(""); // صرفاً برای فرم؛ احراز هویت با توکن انجام می‌شود
let [activemodaldelete,setActivemodaldelete]=useState(false)
const [languages, setLanguages] = useState([]);

const openEnrollDetails = () => setActiveModal('enrollDetails');
const handleEnrollDetailsSubmit = (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (role !== "admin" || !token) {
    alert("دسترسی فقط برای ادمین‌هاست.");
    return;
  }
  if (!enrollCourseId) {
    alert("شناسه دوره را وارد کنید.");
    return;
  }
  // برو به صفحه‌ی جزییات
  navigate(`/enrollments/${enrollCourseId}`);
  setActiveModal(null);
  setEnrollCourseId("");
  setEnrollAdminId("");
};


  // Forms: Teacher
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phonenumber: "",
    national_code: "",
    birthdate: "",
    language_titles: "",
  });

  // Forms: Course Create
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
//language delete
  const [titlelanguage,setTitlelanguage]=useState("")

  // Forms: Course Update
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

  // Forms: Language
  const [languageData, setLanguageData] = useState({ title: "", description: "" });

  // Delete User
  const [UserId, setUserId] = useState("");

  // ======= Auth check =======
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("دسترسی غیرمجاز!");
      navigate("/");
    }
  }, [navigate]);

  // ======= Fetch courses =======
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8000/course/courses");
        setCourses(res.data || []);
      } catch (err) {
        console.error("خطا در گرفتن دوره‌ها:", err);
      }
    };
    fetchCourses();
  }, []);

  // ======= Update stats (دانشجو/استاد/کلاس) =======
  useEffect(() => {
    const UpdateStatic = async () => {
      try {
        const response = await axios.get("http://localhost:8000/student/count");
        const response1 = await axios.get("http://localhost:8000/teacher/count");
        const students = response.data?.total_students || 0;
        const teachers = response1.data?.total_teachers || 0;
        const classes = courses.length || 0;
        setStats([
          { label: "زبان‌آموز", count: students },
          { label: "تعداد استاد", count: teachers },
          { label: "تعداد کلاس", count: classes },
        ]);
      } catch (error) {
        console.error("خطا در دریافت آمار:", error);
      }
    };
    UpdateStatic();
  }, [courses]);

  // ======= Derived charts from real data =======
  const doughnutData = useMemo(() => ({
    labels: ["زبان‌آموز", "استاد"],
    datasets: [
      {
        data: [stats[0]?.count || 0, stats[1]?.count || 0],
      },
    ],
  }), [stats]);

  // group by level for bar chart
  const coursesBar = useMemo(() => {
    const levelMap = new Map();
    for (const c of courses) {
      const lvl = String(c.level || "نامشخص").toUpperCase().trim();
      levelMap.set(lvl, (levelMap.get(lvl) || 0) + 1);
    }
    const labels = Array.from(levelMap.keys());
    const data = Array.from(levelMap.values());
    return {
      labels: labels.length ? labels : ["—"],
      datasets: [{ label: "تعداد دوره‌ها", data: data.length ? data : [0] }],
    };
  }, [courses]);

  // enroll line: by start_time per month
  const enrollLine = useMemo(() => {
    const monthMap = new Map(); // key: YYYY-MM
    for (const c of courses) {
      if (!c.start_time) continue;
      const d = new Date(c.start_time);
      if (isNaN(d)) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthMap.set(key, (monthMap.get(key) || 0) + 1);
    }
    const labels = Array.from(monthMap.keys()).sort();
    const vals = labels.map((k) => monthMap.get(k));
    return {
      labels: labels.length ? labels : ["—"],
      datasets: [
        {
          label: "شروع دوره‌ها به‌تفکیک ماه",
          data: vals.length ? vals : [0],
          fill: true,
          tension: 0.35,
        },
      ],
    };
  }, [courses]);


// شمارش دوره‌ها به ازای هر زبان از روی courses
const coursesByLanguage = useMemo(() => {
  const m = new Map();
  for (const c of courses) {
    const key = (c.language_title || "نامشخص").trim();
    m.set(key, (m.get(key) || 0) + 1);
  }
  return m;
}, [courses]);

// دیتای چارت میله‌ای بر اساس لیست زبان‌ها (اگر خالی بود از keys map)
const languageBar = useMemo(() => {
  const labels = languages.length
    ? languages.map((l) => l.title)
    : Array.from(coursesByLanguage.keys());

  const data = labels.map((lbl) => coursesByLanguage.get(lbl) || 0);

  return {
    labels: labels.length ? labels : ["—"],
    datasets: [
      {
        label: "تعداد دوره‌ها به‌ازای هر زبان",
        data: data.length ? data : [0],
        backgroundColor: "rgba(255, 66, 106, 0.7)", // رنگ میله‌ها
        borderColor: "rgb(255, 66, 106)",           // خط دور میله
        borderWidth: 2,
        borderRadius: 6,                             // (اختیاری) گوشه‌های گرد
        hoverBackgroundColor: "rgba(255, 66, 106, 0.9)",
      },
    ],
  };
}, [languages, coursesByLanguage]);




  // ======= Handlers =======
  const handleAdminLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    alert("با موفقیت خارج شدید.");
    window.location.href = "/";
  };

  // Teacher
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          language_titles: formData.language_titles
            .split(",")
            .map((lang) => lang.trim())
            .filter(Boolean),
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

  // Course Create
  const handleCourseChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const payload = {
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
      await axios.post("http://localhost:8000/course/create", payload, {
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
      // refresh courses
      const res = await axios.get("http://localhost:8000/course/courses");
      setCourses(res.data || []);
    } catch (err) {
      console.error("⛔ خطا در ثبت دوره:", err);
      alert("⛔ خطا در ثبت دوره.");
    }
  };


  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const raw = localStorage.getItem("token");
        const token = raw ? raw.replace(/^"|"$/g, "") : null;
        const res = await axios.get("http://localhost:8000/language/all", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setLanguages(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("خطا در گرفتن زبان‌ها:", err);
        setLanguages([]); // ادامه می‌دیم و فقط از courses استفاده می‌کنیم
      }
    };
    fetchLanguages();
  }, []);
  

  // Course Update
  const handleUpdateCourseChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateCourseData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
      // refresh courses
      const res = await axios.get("http://localhost:8000/course/courses");
      setCourses(res.data || []);
    } catch (err) {
      console.error("⛔ خطا در آپدیت دوره:", err);
      alert("⛔ خطا در آپدیت دوره.");
    }
  };

  // Language
  const handleLanguageChange = (e) => {
    const { name, value } = e.target;
    setLanguageData((prev) => ({ ...prev, [name]: value }));
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

  // Delete User
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
        if (err.response.status === 404) alert("⛔ کاربر با این شناسه یافت نشد.");
        else if (err.response.status === 403) alert("⛔ شما مجوز حذف این کاربر را ندارید.");
        else alert("⛔ خطای سرور: " + (err.response.data?.detail || "نامشخص"));
      } else {
        alert("⛔ خطای شبکه یا سرور رخ داده است.");
      }
    }
  };


  const handlelanguagedelet= async(e)=>{
    e.preventDefault();
    try{
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if(role!="admin"){
        alert("!")
      }
      else{

const response= await axios.delete(`http://localhost:8000/language/${encodeURIComponent(titlelanguage)}`,  
      { headers: { Authorization: `Bearer ${token}` } }
      );
      if(response.status===200){
        alert("با موفقیت زبان حذف شد")
        setTitlelanguage(null)
        setActivemodaldelete(false);
      }
     
      }
    }
    catch (err) {
      console.error("⛔ خطا در حذف زبان:", err);
      if (err.response) {
        const s = err.response.status;
        if (s === 409) {
          alert("دوره‌ای با این زبان وجود دارد؛ حذف مجاز نیست.");
        } else if (s === 404) {
          alert("این زبان یافت نشد.");
        } else if (s === 401) {
          alert("نشست منقضی/نامعتبر است. لطفاً دوباره وارد شوید.");
        } else {
          alert(err.response.data?.detail || "خطای نامشخص سمت سرور.");
        }
      } else {
        alert("ارتباط با سرور برقرار نشد.");
      }
    }

  }





  // ======= Helpers =======
  const statIconFor = (label) => {
    if (label.includes("زبان‌آموز")) return <PeopleIcon  />;
    if (label.includes("استاد")) return <SchoolIcon />;
    if (label.includes("کلاس")) return <ClassIcon />;
    return <TrendingUpIcon />;
  };

  const drawer = (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
            <AssessmentIcon />
          </Avatar>
          <Typography variant="h5" style={{color:"white"}}>Admin Panel</Typography>
        </Stack>
        <IconButton
          size="small"
          onClick={() => (isSm ? setMobileOpen(false) : setDrawerOpen(false))}
          sx={{ color: "#fff" }}
        >
          {/* چپ‌چین بودن منو: بستن کشویی */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </IconButton>
      </Stack>
      <SidebarList />
      <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.12)" }} />
      <Chip
        icon={<NotificationsIcon />}
        label="اعلان‌های جدید: 3"
        variant="outlined"
        sx={{
          color: "#fff",
          borderColor: "rgba(255,255,255,0.35)",
          "& .MuiChip-icon": { color: "rgba(255,255,255,0.9)" },
        }}
      />
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        color: "#eef2f6",
        position: "relative",
        ...(rtl && { direction: "rtl", textAlign: "right" }),
      }}
    >
      <CssBaseline />

      {/* پس‌زمینه گرادیانی + بلاب‌های نوری */}
      <GlobalStyles
        styles={{
          body: {
            background:
              "radial-gradient(1200px 600px at 10% -10%, #6f7bf7 0%, transparent 60%), radial-gradient(1000px 600px at 110% 10%, #a855f7 0%, transparent 55%), linear-gradient(180deg, #0b1020 0%, #0a0f1a 100%)",
          },
        }}
      />
      <Box
        sx={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          zIndex: 0,
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            width: 380,
            height: 380,
            filter: "blur(40px)",
            opacity: 0.55,
            borderRadius: "50%",
          },
          "&::before": {
            top: 80,
            left: rtl ? "auto" : -80,
            right: rtl ? -80 : "auto",
            background:
              "radial-gradient(circle at 30% 30%, #8b5cf6, transparent 60%)",
          },
          "&::after": {
            bottom: 40,
            left: rtl ? -80 : "auto",
            right: rtl ? "auto" : -80,
            background:
              "radial-gradient(circle at 70% 70%, #22d3ee, transparent 60%)",
          },
        }}
      />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          background:
            "linear-gradient(90deg, rgba(38,38,62,.85) 0%, rgba(40,18,62,.85) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: rtl ? 0 : 2, ml: rtl ? 2 : 0 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            پنل مدیریت
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={1}>
            <Tooltip title="خروج">
              <IconButton color="inherit" onClick={handleAdminLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
            <Chip
              label="نسخه بتا"
              size="small"
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.35)",
                borderWidth: 1,
                borderStyle: "solid",
                bgcolor: "rgba(255,255,255,0.08)",
              }}
              variant="outlined"
            />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Drawer موبایل */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "rgba(12,16,28,0.8)",
            backdropFilter: "blur(8px)",
            borderRight: "1px solid rgba(255,255,255,0.12)",
            borderLeft: "none",
          },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>

      {/* Drawer دسکتاپ */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "rgba(12,16,28,0.65)",
            backdropFilter: "blur(8px)",
            borderRight: "1px solid rgba(255,255,255,0.12)",
            borderLeft: "none",
          },
        }}
      >
        <Toolbar />
        {drawer}
      </Drawer>

      {/* Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, position: "relative", zIndex: 1, ml: { sm: drawerOpen ? `${drawerWidth}px` : 0 } }}>
        <Toolbar />

        {/* متریک‌ها */}
        <Grid container spacing={2}>
          {stats.map((s, i) => (
            <Grid key={i} item xs={12} sm={6} md={3}>
              <GlassPaper>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.24)",
                    }}
                  >
                    {statIconFor(s.label)}
                  </Avatar>
                  <Box sx={{ overflow: "hidden" }}>
                    <Typography variant="body2" className="metric-number" sx={{ opacity: 0.85 }}>
                      {s.label}
                    </Typography>
                    <Typography variant="h5" className="metric-number" sx={{ fontWeight: 800 }}>
                      {(s.count ?? 0).toLocaleString("fa-IR")}
                    </Typography>
                  </Box>
                </Stack>
              </GlassPaper>
            </Grid>
          ))}
        </Grid>

        {/* چارت‌ها */}
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={8}>
            <GlassPaper sx={{ height: 380 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 700 }}>روند شروع دوره‌ها</Typography>
              <Box sx={{ height: 310 }}>
                <Line data={enrollLine} options={chartOptions} />
              </Box>
            </GlassPaper>
          </Grid>
          <Grid item xs={12} md={4}>
            <GlassPaper sx={{ height: 380 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 700 }}>نسبت زبان‌آموز/استاد</Typography>
              <Box sx={{ height: 310, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Doughnut data={doughnutData} options={{ ...chartOptions, scales: {} }} />
              </Box>
            </GlassPaper>
          </Grid>
          
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
  <Grid item xs={12} md={6}>
    <GlassPaper sx={{ height: 360 }}>
      <Typography sx={{ mb: 1.5, fontWeight: 700 }}>
        تعداد دوره‌ها بر اساس زبان
      </Typography>
      <Box sx={{ height: 290 }}>
        <Bar data={languageBar} options={chartOptions} />
      </Box>
    </GlassPaper>
  </Grid>
</Grid>
<Grid item xs={12} md={6}>
            <GlassPaper sx={{ height: 360 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 700 }}>تعداد دوره‌ها بر اساس سطح</Typography>
              <Box sx={{ height: 290 }}>
                <Bar data={coursesBar} options={chartOptions} />
              </Box>
            </GlassPaper>
          </Grid>
        </Grid>


        <Grid container spacing={2} sx={{ mt: 0.5 }}>
         

          {/* اکشن‌های سریع */}
        {/* اکشن‌ها (یکپارچه: 3 تا در md، چهار تا در lg) */}
<Grid container spacing={2} sx={{ mt: 0.5 }}>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <GlassPaper sx={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Typography sx={{ fontWeight: 700 }}>افزودن معلم</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>ثبت معلم جدید و زبان‌های تدریسی</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setActiveModal('teacher')}>باز کردن</Button>
    </GlassPaper>
  </Grid>

  <Grid item xs={12} sm={6} md={4} lg={3}>
    <GlassPaper sx={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Typography sx={{ fontWeight: 700 }}>افزودن دوره</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>ساخت دوره با زمان‌بندی و سطح</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setActiveModal('course')}>باز کردن</Button>
    </GlassPaper>
  </Grid>

  <Grid item xs={12} sm={6} md={4} lg={3}>
    <GlassPaper sx={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Typography sx={{ fontWeight: 700 }}>آپدیت دوره</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>ویرایش اطلاعات دوره موجود</Typography>
      <Button color="warning" variant="contained" startIcon={<UpdateIcon />} onClick={() => setActiveModal('updateCourse')}>باز کردن</Button>
    </GlassPaper>
  </Grid>

  <Grid item xs={12} sm={6} md={4} lg={3}>
    <GlassPaper sx={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Typography sx={{ fontWeight: 700 }}>افزودن زبان</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>تعریف زبان جدید برای دوره‌ها</Typography>
      <Button color="secondary" variant="contained" startIcon={<LanguageIcon />} onClick={() => setActiveModal('language')}>باز کردن</Button>
    </GlassPaper>
  </Grid>

  <Grid item xs={12} sm={6} md={4} lg={3}>
    <GlassPaper sx={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Typography sx={{ fontWeight: 700 }}>مشاهده جزئیات کاربران</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>اگر شناسه کاربران را نمی‌دانی، لیست را ببین</Typography>
      <Button component={Link} to="/detailu" variant="contained">مشاهده لیست کاربران</Button>
    </GlassPaper>
  </Grid>

  <Grid item xs={12} sm={6} md={4} lg={3}>
    <GlassPaper sx={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Typography sx={{ fontWeight: 700 }}>مشاهده جزئیات دوره‌ها</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>اگر شناسه دوره را نمی‌دانی، لیست را ببین</Typography>
      <Button component={Link} to="/detail" variant="contained">مشاهده لیست دوره‌ها</Button>
    </GlassPaper>
  </Grid>

  <Grid item xs={12} sm={6} md={4} lg={3}>
    <GlassPaper sx={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Typography sx={{ fontWeight: 700 }}>جزئیات ثبت‌نام‌ها</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>افراد ثبت‌نام‌شده در یک دوره</Typography>
      <Button variant="contained" onClick={openEnrollDetails}>باز کردن</Button>
    </GlassPaper>
  </Grid>

  <Grid item xs={12} sm={6} md={4} lg={3}>
    <GlassPaper sx={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Typography sx={{ fontWeight: 700 }}>حذف کاربر</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>حذف دانشجو با شناسه</Typography>
      <Button color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => setActiveModal('deleteUser')}>
        باز کردن
      </Button>
    </GlassPaper>
  </Grid>
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <GlassPaper sx={{ minHeight: 180, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Typography sx={{ fontWeight: 700 }}>حذف زبان</Typography>
      <Typography variant="body2" sx={{ opacity: 0.8 }}>حذف زبان با کلمه</Typography>
      <Button color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => setActivemodaldelete(true)}>
        باز کردن
      </Button>
    </GlassPaper>
  </Grid>
</Grid>
</Grid>



      </Box>



      {/* ======== Modals (MUI Dialog) ======== */}

      {/* Add Teacher */}
      <Dialog open={activeModal === 'teacher'} onClose={() => setActiveModal(null)} fullWidth maxWidth="md">
        <DialogTitle>افزودن معلم</DialogTitle>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="نام کاربری" name="username" value={formData.username} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="ایمیل" type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="رمز عبور" type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="شماره تلفن" name="phonenumber" value={formData.phonenumber} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="کد ملی" name="national_code" value={formData.national_code} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="تاریخ تولد" type="date" name="birthdate" value={formData.birthdate} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="زبان‌ها (با کاما جدا کن)" name="language_titles" placeholder="مثال: English, German, French" value={formData.language_titles} onChange={handleChange} required />
              </Grid>
              {message && (
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ textAlign: 'center' }}>{message}</Alert>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActiveModal(null)}>بستن</Button>
            <Button type="submit" variant="contained">ثبت معلم</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Add Course */}
      <Dialog open={activeModal === 'course'} onClose={() => setActiveModal(null)} fullWidth maxWidth="md">
        <DialogTitle>افزودن دوره</DialogTitle>
        <Box component="form" onSubmit={handleCourseSubmit} noValidate>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="زبان" name="language_title" value={courseData.language_title} onChange={handleCourseChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="نام استاد" name="teacher_name" value={courseData.teacher_name} onChange={handleCourseChange} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="سطح" name="level" placeholder="A1, B2, ..." value={courseData.level} onChange={handleCourseChange} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="زمان شروع" type="datetime-local" name="start_time" value={courseData.start_time} onChange={handleCourseChange} required InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="زمان پایان" type="datetime-local" name="end_time" value={courseData.end_time} onChange={handleCourseChange} required InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="قیمت" type="number" name="price" inputProps={{ min: 0 }} value={courseData.price} onChange={handleCourseChange} required />
              </Grid>
              <Grid item xs={12}>
                <Stack direction={isSm ? 'column' : 'row'} spacing={2}>
                  <FormControlLabel  control={<Checkbox name="is_online" checked={courseData.is_online} onChange={handleCourseChange } style={{color:"white"}} />} label ="آنلاین است" />
                  <FormControlLabel control={<Checkbox name="is_completed" checked={courseData.is_completed} onChange={handleCourseChange} />} label="تکمیل شده" />
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActiveModal(null)}>بستن</Button>
            <Button type="submit" variant="contained">ثبت دوره</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Update Course */}
      <Dialog open={activeModal === 'updateCourse'} onClose={() => setActiveModal(null)} fullWidth maxWidth="md">
        <DialogTitle>آپدیت دوره</DialogTitle>
        <Box component="form" onSubmit={handleUpdateCourseSubmit} noValidate>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="شناسه دوره (ID)" type="number" name="updateCourseId" value={updateCourseId} onChange={handleUpdateCourseIdChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="زبان" name="language_title" value={updateCourseData.language_title} onChange={handleUpdateCourseChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="نام استاد" name="teacher_name" value={updateCourseData.teacher_name} onChange={handleUpdateCourseChange} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="سطح" name="level" value={updateCourseData.level} onChange={handleUpdateCourseChange} required />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="زمان شروع" type="datetime-local" name="start_time" value={updateCourseData.start_time} onChange={handleUpdateCourseChange} required InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="زمان پایان" type="datetime-local" name="end_time" value={updateCourseData.end_time} onChange={handleUpdateCourseChange} required InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="قیمت" type="number" name="price" value={updateCourseData.price} onChange={handleUpdateCourseChange} required />
              </Grid>
              <Grid item xs={12}>
                <Stack direction={isSm ? 'column' : 'row'} spacing={2}>
                  <FormControlLabel control={<Checkbox name="is_online" checked={updateCourseData.is_online} onChange={handleUpdateCourseChange} />} label="آنلاین است" />
                  <FormControlLabel control={<Checkbox name="is_completed" checked={updateCourseData.is_completed} onChange={handleUpdateCourseChange} />} label="تکمیل شده" />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  اگر ایدی کورس را ندارید، می‌توانید از لیست دوره‌ها پیدا کنید.
                  <Button component={Link} to="/detail" size="small" variant="outlined">مشاهده دوره‌ها</Button>
                </Alert>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActiveModal(null)}>بستن</Button>
            <Button type="submit" color="warning" variant="contained">آپدیت دوره</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Add Language */}
      <Dialog open={activeModal === 'language'} onClose={() => setActiveModal(null)} fullWidth maxWidth="sm">
        <DialogTitle>افزودن زبان</DialogTitle>
        <Box component="form" onSubmit={handleLanguageSubmit} noValidate>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="عنوان زبان" name="title" value={languageData.title} onChange={handleLanguageChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="توضیحات" name="description" value={languageData.description} onChange={handleLanguageChange} required />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActiveModal(null)}>بستن</Button>
            <Button type="submit" variant="contained">ثبت زبان</Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete User */}
      <Dialog open={activeModal === 'deleteUser'} onClose={() => setActiveModal(null)} fullWidth maxWidth="xs">
        <DialogTitle>حذف کاربر</DialogTitle>
        <Box component="form" onSubmit={handleUserSubmit} noValidate>
          <DialogContent>
            <TextField fullWidth label="شناسه کاربر (ID)" type="number" value={UserId} onChange={handleUserId} required inputProps={{ min: 1 }} />
            <Alert severity="warning" sx={{ mt: 2 }}>
              با زدن دکمه حذف، کاربر به صورت دائمی حذف می‌شود. لطفاً دقت کنید.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActiveModal(null)}>بستن</Button>
            <Button type="submit" color="error" variant="contained" startIcon={<DeleteIcon />}>حذف کاربر</Button>
          </DialogActions>
        </Box>
      </Dialog>
      {/* Enrollment Details (by course) */}
<Dialog open={activeModal === 'enrollDetails'} onClose={() => setActiveModal(null)} fullWidth maxWidth="xs">
  <DialogTitle>جزئیات ثبت‌نام‌های دوره</DialogTitle>
  <Box component="form" onSubmit={handleEnrollDetailsSubmit} noValidate>
    <DialogContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="شناسه دوره (Course ID)" type="number"
            value={enrollCourseId} onChange={(e)=>setEnrollCourseId(e.target.value)} required />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="شناسه ادمین (اختیاری)" type="number"
            value={enrollAdminId} onChange={(e)=>setEnrollAdminId(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <Alert severity="info">برای مشاهده نیاز به توکن ادمین دارید (از LocalStorage خوانده می‌شود).</Alert>
        </Grid>
      </Grid>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setActiveModal(null)}>بستن</Button>
      <Button type="submit" variant="contained">مشاهده</Button>
    </DialogActions>
  </Box>
</Dialog>

<Dialog open={activemodaldelete === true} onClose={() => setActivemodaldelete(false)} fullWidth maxWidth="xs">
        <DialogTitle>حذف زبان</DialogTitle>
        <Box component="form" onSubmit={handlelanguagedelet} noValidate>
          <DialogContent>
            <TextField fullWidth label="نام زبان"  value={titlelanguage}         onChange={(e) => setTitlelanguage(e.target.value)}
  />
            <Alert severity="warning" sx={{ mt: 2 }}>
              با زدن دکمه حذف، زبان به صورت دائمی حذف می‌شود. لطفاً دقت کنید.
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActivemodaldelete(false)}>بستن</Button>
            <Button type="submit" color="error" variant="contained" startIcon={<DeleteIcon />}>حذف زبان</Button>
          </DialogActions>
        </Box>
      </Dialog>


    </Box>
  );
}


