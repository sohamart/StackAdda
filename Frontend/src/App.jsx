import { Routes, Route } from "react-router-dom";


// Layout
import MainLayout from "./Layout/MainLayout";
import StudentLayout from "./Layout/StudentLayout";
import AdminLayout from "./Layout/AdminLayout";

// Protected Route
import ProtectedRoute from "./Components/ProtectedRoute";

// Public Pages
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import CourseDetails from "./Pages/Courses/CourseDetails";
import CoursePreview from "./Pages/Courses/CoursePreview";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import VerifyEmail from "./Pages/Auth/VerifyEmail";
import ForgotPassword from "./Pages/Auth/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword";
import NotFound from "./Pages/NotFound";


// Student Pages
import StudentDashboard from "./Pages/Student/Dashboard";
import StudentProfile from "./Pages/Student/Profile";
import MyCourses from "./Pages/Student/MyCourses";
import LearnCourse from "./Pages/Student/LearnCourse";
import StudentOrders from "./Pages/Student/Orders";
import StudentPayments from "./Pages/Student/Payments";
import AttendLiveClass from "./Pages/LiveClass/AttendLiveClass";

// Global Components
import GlobalLiveAlert from "./Components/LiveClass/GlobalLiveAlert";

// Hooks
import useAntiPiracy from "./Hooks/useAntiPiracy";

// Admin Pages
import AdminDashboard from "./Pages/Admin/Dashboard";
import Students from "./Pages/Admin/Students";
import StudentDetails from "./Pages/Admin/StudentDetails";
import AdminCourses from "./Pages/Admin/Courses";
import PublicCourses from "./Pages/Courses/Courses";
import CreateCourse from "./Pages/Admin/CreateCourse";
import EditCourse from "./Pages/Admin/EditCourse";
import CourseManager from "./Pages/Admin/CourseManager";
import Coupons from "./Pages/Admin/Coupons";
import Orders from "./Pages/Admin/Orders";
import ResourceManager from "./Pages/Admin/ResourceManager";
import Contacts from "./Pages/Admin/Contacts";



function App() {
  // Aggressive anti-piracy protection
  useAntiPiracy();

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
        <Route path="/courses/:slug" element={<CourseDetails />} />
        <Route path="/courses/:slug/preview/:lessonId" element={<CoursePreview />} />
        <Route path="/about" element={<About />} />
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
  <Route path="courses" element={<MyCourses />} />
  <Route path="course/:id" element={<LearnCourse />} />
  <Route path="orders" element={<StudentOrders />} />
  <Route path="payments" element={<StudentPayments />} />
</Route>
<Route path="/live-class/:id" element={
  <ProtectedRoute role="student">
     <AttendLiveClass />
  </ProtectedRoute>
} />

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
        <Route
    path="student/:id"
    element={<StudentDetails />}/>
        <Route path="profile" element={<StudentProfile />} /> //same admin profile page as student profile page
        <Route path="courses" element={<AdminCourses />} />
        <Route path="course/create" element={<CreateCourse />} />
        <Route path="course/edit/:id" element={<EditCourse />} />
        <Route path="course/:id" element={<CourseManager />} />
        <Route path="course/:id/resources" element={<ResourceManager />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="orders" element={<Orders />} />
        <Route path="contacts" element={<Contacts />} />
      </Route>

      {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
