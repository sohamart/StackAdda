import { Routes, Route } from "react-router-dom";


// Layout
import MainLayout from "./Layout/MainLayout";
import StudentLayout from "./Layout/StudentLayout";
import AdminLayout from "./Layout/AdminLayout";

// Protected Route
import ProtectedRoute from "./Components/ProtectedRoute";

// Public Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import NotFound from "./Pages/NotFound";
import Courses from "./Pages/Courses/Courses";

// Student Pages
import StudentDashboard from "./Pages/Student/Dashboard";
import StudentProfile from "./Pages/Student/Profile";

// Admin Pages
import AdminDashboard from "./Pages/Admin/Dashboard";
import Students from "./Pages/Admin/Students";

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />
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
</Route>

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
    element={<StudentDetails />}
/>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;