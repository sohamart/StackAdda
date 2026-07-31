import { useEffect, useState } from "react";
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
import Shorts from "./Pages/Shorts";

// Student Pages
import StudentDashboard from "./Pages/Student/Dashboard";
import StudentProfile from "./Pages/Student/Profile";
import AttendLiveClass from "./Pages/LiveClass/AttendLiveClass";
import StudentInstructors from "./Pages/Student/Instructors";
import StudentMyCourses from "./Pages/Student/MyCourses";

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
import AdminShorts from "./Pages/Admin/AdminShorts";
import CourseDetails from "./Pages/Courses/CourseDetails";
import CoursePlayer from "./Pages/Student/CoursePlayer";

function App() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Handle global Splash Screen loading state
    const handleLoad = () => {
      setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => setIsAppLoaded(true), 600); // Wait for fade transition
      }, 1000); // Guarantee logo is visible for at least 1s
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      const fallback = setTimeout(handleLoad, 4000);
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(fallback);
      };
    }
  }, []);

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
      {!isAppLoaded && (
        <div 
          className={`fixed inset-0 z-[99999] bg-[#0c0c0c] flex items-center justify-center transition-opacity duration-700 ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <div className="relative flex items-center justify-center animate-pulse">
             <div className="absolute inset-0 bg-orange-500/20 blur-[60px] rounded-full scale-150" />
             <img src="/favicon.png" alt="Stack Adda" className="w-28 md:w-36 h-auto relative z-10" />
          </div>
        </div>
      )}
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
          <Route path="/shorts" element={<Shorts />} />
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
          <Route path="my-courses" element={<StudentMyCourses />} />
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
          <Route path="shorts" element={<AdminShorts />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
