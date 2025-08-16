// TeacherPanelGlam.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Stack, Chip, Button,
  Grid, Paper, Avatar, Tooltip, TextField, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, GlobalStyles
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import ClassIcon from "@mui/icons-material/Class";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import "./amin.css"
const API_BASE = "http://localhost:8000";

// === Helpers (بدون تغییر در منطق API) ===
const authHeaders = () => {
  const raw = localStorage.getItem("token");
  const token = raw ? raw.replace(/^"|"$/g, "") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
};
const toMessage = (err) => {
  const data = err?.response?.data;
  if (typeof data === "string") return data;
  const detail = data?.detail || data?.message;
  if (typeof detail === "string") return detail;
  if (Array.isArray(data)) return JSON.stringify(data);
  if (data?.msg) return data.msg;
  return err?.message || "خطای نامشخص";
};










// بالای کامپوننت
const inputSX = {
  "& .MuiInputBase-input": { color: "#fff" },                      // متن داخل ورودی
  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.75)" },    // لیبل
  "& .MuiOutlinedInput-notchedOutline": {                          // کادر
    borderColor: "rgba(255,255,255,0.35)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.6)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#fff",
  },
};

// کارت گلس
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
        boxShadow: "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
}

export default function TeacherPanelGlam({ rtl = true }) {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "teacher";

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all"); // all | online | offline
  const [profile, setProfile] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const [activeModal, setActiveModal] = useState(null); // 'live' | 'students' | null
  const [activeCourse, setActiveCourse] = useState(null);

  const [meetLink, setMeetLink] = useState("");
  const [meetStatus, setMeetStatus] = useState({ type: "", msg: "" });
  const [workingMeet, setWorkingMeet] = useState(false);

  // خروج
  const handleLogout = () => {
    ["token", "role", "username", "userID"].forEach((k) => localStorage.removeItem(k));
    window.location.href = "/";
  };

  // لود کورس‌ها و پروفایل (همان Endpointها)
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
        console.error(e);
        setCourses([]);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [role]);

  // لود دانشجوها (طبق کد خودت: همهٔ دانشجویان کورس‌های معلم)
  useEffect(() => {
    if (role !== "teacher") return;
    const run = async () => {
      setLoadingStudents(true);
      try {
        const r = await axios.get(`${API_BASE}/teacher/enrolled_students`, { headers: authHeaders() });
        setStudents(r.data || []);
      } catch (e) {
        console.error(e);
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

  const openCourseLive = (course) => {
    setActiveCourse(course);
    setMeetStatus({ type: "", msg: "" });
    setMeetLink("");
    setActiveModal("live");
  };
  const openCourseStudents = (course) => {
    setActiveCourse(course);
    setActiveModal("students");
  };
  const [videoModalOpen, setVideoModalOpen] = useState(false);
const [videoCourse, setVideoCourse] = useState(null);

const [videoTitle, setVideoTitle] = useState("");
const [videoFile, setVideoFile] = useState(null);

const [videoUploading, setVideoUploading] = useState(false);
const [videoStatus, setVideoStatus] = useState({ type: "", msg: "" });
const [uploadPct, setUploadPct] = useState(0); // درصد پیشرفت

  const openVideoModal = (course) => {
    setVideoCourse(course);
    setVideoTitle("");
    setVideoFile(null);
    setVideoStatus({ type: "", msg: "" });
    setVideoModalOpen(true);
  };

  const handleVideoUpload = async () => {
    console.log("videoCourse", videoCourse);

    if (!videoCourse) {
      setVideoStatus({ type: "warning", msg: "ابتدا یک دوره انتخاب کنید." });
      return;
    }
    if (!videoTitle.trim()) {
      setVideoStatus({ type: "warning", msg: "عنوان ویدیو را وارد کنید." });
      return;
    }
    if (!videoFile) {
      setVideoStatus({ type: "warning", msg: "فایل ویدیو را انتخاب کنید." });
      return;
    }
  
    const fd = new FormData();
    fd.append("title", videoTitle);
    fd.append("course_id", String(videoCourse.id));
    fd.append("file", videoFile);
  
    try {
      setVideoUploading(true);
      setVideoStatus({ type: "", msg: "" });
      setUploadPct(0);
  
      await axios.post(`${API_BASE}/videos/upload`, fd, {
        headers: authHeaders(),
        onUploadProgress: (e) => {
          if (e.total) {
            setUploadPct(Math.round((e.loaded * 100) / e.total));
          }
        },
      });
  
      setVideoStatus({ type: "success", msg: "آپلود با موفقیت انجام شد." });
      // تمیزکاری فرم
      setVideoTitle("");
      setVideoFile(null);
      setUploadPct(0);
    } catch (err) {
      setVideoStatus({ type: "danger", msg: toMessage(err) });
    } finally {
      setVideoUploading(false);
    }
  };
  


  const getTeacherId = () => {
    const id = Number(profile?.id);
    return Number.isFinite(id) && id > 0 ? id : null;
  };

  const saveMeetLink = async () => {
    if (!activeCourse) return;
    if (!meetLink) {
      setMeetStatus({ type: "warning", msg: "لطفاً لینک را وارد کنید." });
      return;
    }
    const teacherId = getTeacherId();
    if (!teacherId) {
      setMeetStatus({ type: "danger", msg: "شناسه معلم نامعتبر است. دوباره وارد شوید." });
      return;
    }
    setWorkingMeet(true);
    setMeetStatus({ type: "", msg: "" });
    try {
      await axios.post(
        `${API_BASE}/course/course/${activeCourse.id}/add-meet-link`,
        null,
        { headers: authHeaders(), params: { meet_link: meetLink, teacher_id: teacherId } }
      );
      setMeetStatus({ type: "success", msg: "لینک با موفقیت ثبت/به‌روزرسانی شد." });
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
      setMeetStatus({ type: "danger", msg: "شناسه معلم نامعتبر است." });
      return;
    }
    setWorkingMeet(true);
    setMeetStatus({ type: "", msg: "" });
    try {
      await axios.delete(
        `${API_BASE}/course/course/${activeCourse.id}/remove-meet-link`,
        { headers: authHeaders(), params: { teacher_id: teacherId } }
      );
      setMeetLink("");
      setMeetStatus({ type: "success", msg: "لینک حذف شد." });
    } catch (err) {
      setMeetStatus({ type: "danger", msg: toMessage(err) });
    } finally {
      setWorkingMeet(false);
    }
  };

  // ذخیره پروفایل (بدون تغییر در API)
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
      <Box className="container py-5">
        <Alert severity="error">دسترسی فقط برای نقش «معلم» است.</Alert>
      </Box>
    );
  }

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
      {/* پس‌زمینه مثل پنل ادمین */}
      <GlobalStyles
        styles={{
          body: {
            background:
              "radial-gradient(1200px 600px at 10% -10%, #6f7bf7 0%, transparent 60%), radial-gradient(1000px 600px at 110% 10%, #a855f7 0%, transparent 55%), linear-gradient(180deg, #0b1020 0%, #0a0f1a 100%)",
          },
        }}
      />

      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          background: "linear-gradient(90deg, rgba(38,38,62,.85) 0%, rgba(40,18,62,.85) 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            پنل معلم
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {/* فیلترها */}
          <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
            <Chip
              label="همه"
              onClick={() => setFilter("all")}
              color={filter === "all" ? "primary" : "default"}
              variant={filter === "all" ? "filled" : "outlined"}
              clickable
              sx={{
                color: "#fff",
                backgroundColor: "transparent",
              }}
            />
            <Chip
              label="آنلاین"
              onClick={() => setFilter("online")}
              color={filter === "online" ? "primary" : "default"}
              variant={filter === "online" ? "filled" : "outlined"}
              clickable
              sx={{
                color: "#fff",
                backgroundColor: "transparent",
              }}
            />
            <Chip
              label="آفلاین"
              onClick={() => setFilter("offline")}
              color={filter === "offline" ? "primary" : "default"}
              variant={filter === "offline" ? "filled" : "outlined"}
              clickable
              sx={{
                color: "#fff",
                backgroundColor: "transparent",
              }}
            />
          </Stack>
          <Tooltip title="خروج">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* محتوا */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, position: "relative", zIndex: 1 }}>
        <Toolbar />

        <Grid container spacing={2}>
          {/* خلاصه کوچک */}
          <Grid item xs={12} md={4} lg={3}>
            <GlassPaper>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.24)" }}>
                  <ClassIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>تعداد کلاس‌های شما</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {filteredCourses.length.toLocaleString("fa-IR")}
                  </Typography>
                </Box>
              </Stack>
            </GlassPaper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <GlassPaper>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.24)" }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.85 }}>دانشجویان (تمام کلاس‌ها)</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {students.length.toLocaleString("fa-IR")}
                  </Typography>
                </Box>
              </Stack>
            </GlassPaper>
          </Grid>
        </Grid>

        {/* لیست کلاس‌ها */}
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          {loading ? (
            <Grid item xs={12}><GlassPaper>در حال بارگذاری…</GlassPaper></Grid>
          ) : !filteredCourses.length ? (
            <Grid item xs={12}>
              <GlassPaper><Typography sx={{ opacity: 0.8 }}>هیچ کلاسی یافت نشد.</Typography></GlassPaper>
            </Grid>
          ) : (
            filteredCourses.map((c) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={c.id}>
                <GlassPaper sx={{ height: "100%" }}>
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "white" }}>{c.language_title}</Typography>
                      <Chip
                        size="small"
                        label={c.is_online ? "آنلاین" : "آفلاین"}
                        color="white"
                        variant="outlined"
                        sx={{
                          color: "#fff",
                          backgroundColor: "transparent",
                          borderColor: c.is_online ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)", // سبز/قرمز
                        }}

                      />
                    </Stack>
                    <Typography variant="body2" sx={{ opacity: 0.85, color: "white" }}>
                      سطح: {c.level} • قیمت: {Number(c.price || 0).toLocaleString("fa-IR")} تومان
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      {c.is_online && (
                        <Button
                          variant="contained"
                          startIcon={<VideoCallIcon />}
                          onClick={() => openCourseLive(c)}
                          className="me-4"

                        >
                          لینک کلاس
                        </Button>
                      )}
                      {!c.is_online && (
                        <Button
                          variant="outlined"
                          startIcon={<VideoCallIcon />}
                          onClick={() => openVideoModal(c)}
                          className="me-4"
                        >
                          آپلود ویدیو
                        </Button>
                      )}

                      <Button
                        variant="outlined"
                        startIcon={<PeopleIcon />}
                        onClick={() => openCourseStudents(c)}
                      >
                        دانشجویان
                      </Button>
                    </Stack>
                  </Stack>
                </GlassPaper>
              </Grid>
            ))
          )}
        </Grid>

        {/* پروفایل معلم */}
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <GlassPaper>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "white" }}>پروفایل</Typography>
              {!profile ? (
                <Typography sx={{ opacity: 0.8, color: "white" }}>در حال بارگذاری…</Typography>
              ) : (
                <Box component="form" onSubmit={onSaveProfile}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth label="نام کاربری" value={profile.username || ""}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        sx={inputSX}

                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField style={{ color: "white" }}
                        fullWidth type="email" label="ایمیل" value={profile.email || ""}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        sx={inputSX}

                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField style={{ color: "white" }}
                        fullWidth label="شماره تماس" value={profile.phonenumber || ""}
                        onChange={(e) => setProfile({ ...profile, phonenumber: e.target.value })}
                        sx={inputSX}

                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField style={{ color: "white" }}
                        fullWidth label="درباره من" value={profile.description || ""}
                        onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                        sx={inputSX}

                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Stack direction="row" spacing={1}>
                        <Button type="submit" variant="contained" disabled={savingProfile}>
                          {savingProfile ? "در حال ذخیره…" : "ذخیره تغییرات"}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={async () => {
                            try {
                              const r = await axios.get(`${API_BASE}/teacher/profile`, { headers: authHeaders() });
                              setProfile(r.data || profile);
                            } catch { /* ignore */ }
                          }}
                        >
                          بازخوانی از سرور
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </GlassPaper>
          </Grid>
        </Grid>
      </Box>

      {/* ===== Modals ===== */}

      {/* Live Link */}
      <Dialog open={activeModal === "live"} onClose={() => setActiveModal(null)} fullWidth maxWidth="sm">
        <DialogTitle>
          لینک کلاس آنلاین • {activeCourse?.language_title || ""}
        </DialogTitle>
        <DialogContent dividers>
          {activeCourse?.is_online ? (
            <>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <InfoOutlinedIcon fontSize="small" />
                <Typography variant="body2">کد کورس: <b>#{activeCourse?.id}</b></Typography>
              </Stack>
              <TextField
                fullWidth type="url" label="آدرس جلسه (Meet/Zoom/…)"
                placeholder="https://..."
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                sx={inputSX}

              />
              {meetStatus.msg && (
                <Alert sx={{ mt: 2 }} severity={meetStatus.type === "danger" ? "error" :
                  meetStatus.type === "success" ? "success" :
                    meetStatus.type === "warning" ? "warning" : "info"}>
                  {String(meetStatus.msg)}
                </Alert>
              )}
            </>
          ) : (
            <Alert severity="info">این کورس آفلاین است.</Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActiveModal(null)}>بستن</Button>
          {activeCourse?.is_online && (
            <>
              <Button color="error" variant="outlined" onClick={deleteMeetLink} disabled={workingMeet}>
                حذف لینک
              </Button>
              <Button variant="contained" onClick={saveMeetLink} disabled={workingMeet}>
                {workingMeet ? "در حال ذخیره…" : "ذخیره"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Students */}
      <Dialog open={activeModal === "students"} onClose={() => setActiveModal(null)} fullWidth maxWidth="md">
        <DialogTitle>
          دانشجویان ثبت‌نام‌شده {activeCourse ? `• ${activeCourse.language_title}` : ""}
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 2 }}>
            طبق بک‌اند فعلی، این لیست شامل <b>کل دانشجویانِ تمام کورس‌های شما</b>ست.
            برای فیلتر دقیق به‌ازای هر کورس، نیاز به API مثل
            <code> /teacher/courses/{"{course_id}"}/students </code> است.
          </Alert>
          {loadingStudents ? (
            <Typography>در حال بارگذاری…</Typography>
          ) : !students.length ? (
            <Typography sx={{ opacity: 0.8 }}>دانشجویی یافت نشد.</Typography>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>#</th>
                    <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>نام کاربری</th>
                    <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>ایمیل</th>
                    <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>تلفن</th>
                    <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>کد ملی</th>
                    <th style={{ textAlign: "right", padding: 8, borderBottom: "1px solid rgba(255,255,255,0.15)" }}>تاریخ تولد</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => (
                    <tr key={s.id || idx}>
                      <td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{idx + 1}</td>
                      <td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{s.username}</td>
                      <td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{s.email}</td>
                      <td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{s.phonenumber}</td>
                      <td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{s.national_code}</td>
                      <td style={{ padding: 8, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{s.birthdate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActiveModal(null)}>بستن</Button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          آپلود ویدیو • {videoCourse ? videoCourse.language_title : ""}
        </DialogTitle>
        <DialogContent dividers>
          {!videoCourse ? (
            <Alert severity="info">ابتدا یک دوره را انتخاب کنید.</Alert>
          ) : (
            <>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <InfoOutlinedIcon fontSize="small" />
                <Typography variant="body2">
                  کد کورس: <b>#{videoCourse.id}</b>
                </Typography>
              </Stack>

              <TextField
                fullWidth
                label="عنوان ویدیو"
                placeholder="Session 1 - Introduction"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                sx={inputSX}
              />

              {/* انتخاب فایل ویدیو */}
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="contained" component="label">
                  انتخاب فایل ویدیو
                  <input
                    hidden
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  />
                </Button>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  {videoFile ? videoFile.name : "فایلی انتخاب نشده است"}
                </Typography>
              </Stack>

              {videoStatus.msg && (
                <Alert
                  sx={{ mt: 2 }}
                  severity={
                    videoStatus.type === "danger"
                      ? "error"
                      : videoStatus.type === "success"
                        ? "success"
                        : videoStatus.type === "warning"
                          ? "warning"
                          : "info"
                  }
                >
                  {String(videoStatus.msg)}
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVideoModalOpen(false)}>بستن</Button>
          <Button
            variant="contained"
            onClick={handleVideoUpload}
            disabled={!videoCourse || videoUploading}
          >
            {videoUploading ? "در حال آپلود…" : "آپلود"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
  open={videoModalOpen}
  onClose={() => setVideoModalOpen(false)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle>
    آپلود ویدیو • {videoCourse ? videoCourse.language_title : ""}
  </DialogTitle>

  <DialogContent dividers>
    {!videoCourse ? (
      <Alert severity="info">ابتدا یک دوره را انتخاب کنید.</Alert>
    ) : (
      <>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <InfoOutlinedIcon fontSize="small" />
          <Typography variant="body2">
            کد کورس: <b>#{videoCourse.id}</b>
          </Typography>
        </Stack>

        <TextField
          fullWidth
          label="عنوان ویدیو"
          placeholder="مثلاً: جلسه ۱ - معرفی"
          value={videoTitle}
          onChange={(e) => setVideoTitle(e.target.value)}
          required
          helperText="یک عنوان معنادار برای ویدیو وارد کنید."
          // اگر تم تاریک داری:
          // sx={inputSX}
          sx={{ mb: 2 }}
        />

        {/* انتخاب فایل ویدیو */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
          <Button variant="contained" component="label">
            انتخاب فایل ویدیو
            <input
              hidden
              type="file"
              accept="video/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setVideoFile(f);
                setVideoStatus(
                  f
                    ? { type: "info", msg: `فایل «${f.name}» انتخاب شد.` }
                    : { type: "warning", msg: "فایلی انتخاب نشد." }
                );

                // — اگر می‌خوای به‌محض انتخاب فایل، خودکار آپلود بشه و عنوان هم پر شده:
                // if (f && videoTitle.trim()) handleVideoUpload();
              }}
            />
          </Button>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            {videoFile ? videoFile.name : "فایلی انتخاب نشده است"}
          </Typography>
        </Stack>

        {/* Progress هنگام آپلود */}
        {videoUploading && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption">در حال آپلود: {uploadPct}%</Typography>
            <Box
              sx={{
                mt: 0.5,
                height: 6,
                width: "100%",
                bgcolor: "rgba(255,255,255,0.15)",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${uploadPct}%`,
                  bgcolor: "#2dd4bf",
                  transition: "width .2s ease",
                }}
              />
            </Box>
          </Box>
        )}

        {videoStatus.msg && (
          <Alert
            sx={{ mt: 2 }}
            severity={
              videoStatus.type === "danger"
                ? "error"
                : videoStatus.type === "success"
                ? "success"
                : videoStatus.type === "warning"
                ? "warning"
                : "info"
            }
          >
            {String(videoStatus.msg)}
          </Alert>
        )}
      </>
    )}
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setVideoModalOpen(false)}>بستن</Button>
    <Button
      variant="contained"
      onClick={handleVideoUpload}
      disabled={!videoCourse || !videoTitle.trim() || !videoFile || videoUploading}
    >
      {videoUploading ? "در حال آپلود…" : "آپلود"}
    </Button>
  </DialogActions>
</Dialog>


    </Box>
  );
}
