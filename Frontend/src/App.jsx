import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Layout
import MainLayout from "./Layout/MainLayout";
import StudentLayout from "./Layout/StudentLayout";
import AdminLayout from "./Layout/AdminLayout";

// Protected Route
import ProtectedRoute from "./Components/ProtectedRoute";

// Public Pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import Channels from "./Pages/Channels";
import Contact from "./Pages/Contact";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import VerifyEmail from "./Pages/Auth/VerifyEmail";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import NotFound from "./Pages/NotFound";

// Student Pages
import StudentDashboard from "./Pages/Student/Dashboard";
import StudentProfile from "./Pages/Student/Profile";
import AttendLiveClass from "./Pages/LiveClass/AttendLiveClass";
import StudentInstructors from "./Pages/Student/Instructors";

// Global Components
import GlobalLiveAlert from "./Components/LiveClass/GlobalLiveAlert";

// Admin Pages
import AdminDashboard from "./Pages/Admin/Dashboard";
import Students from "./Pages/Admin/Students";
import StudentDetails from "./Pages/Admin/StudentDetails";
import PublicCourses from "./Pages/Courses/Courses";
import Contacts from "./Pages/Admin/Contacts";
import AdminYoutubeVideos from "./Pages/Admin/YoutubeVideos";
import AdminChannels from "./Pages/Admin/AdminChannels";
import AdminCourseBuilder from "./Pages/Admin/CourseBuilder";
import AdminCourses from "./Pages/Admin/AdminCourses";
import CourseDetails from "./Pages/Courses/CourseDetails";
import CoursePlayer from "./Pages/Student/CoursePlayer";

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
    });

    // Synchronize Lenis scrolling with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Tell GSAP to use its ticker to update Lenis instead of the standard requestAnimationFrame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <GlobalLiveAlert />
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/courses" element={<PublicCourses />} />
          <Route path="/course/:slug" element={<CourseDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/channels" element={<Channels />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="instructors" element={<StudentInstructors />} />
          <Route path="learn/:id" element={<CoursePlayer />} />
        </Route>
        <Route
          path="/live-class/:id"
          element={
            <ProtectedRoute role="student">
              <AttendLiveClass />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="student/:id" element={<StudentDetails />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="youtube-videos" element={<AdminYoutubeVideos />} />
          <Route path="channels" element={<AdminChannels />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="course-builder" element={<AdminCourseBuilder />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
