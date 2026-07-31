import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Loader2 } from "lucide-react";
import API from "../../api/axios";
import { useAuth } from "../../Context/AuthContext";

export default function MyCourses() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/student/dashboard")
      .then(({ data }) => {
        setEnrolledCourses(data.dashboard?.enrolledCourses || []);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative min-h-screen text-white pb-20">
      <div className="absolute top-0 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-8">
        <div>
          <h1 className="text-3xl font-black md:text-4xl">My Courses</h1>
          <p className="mt-2 text-white/60">Continue your learning journey.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-orange-500" size={40} />
          </div>
        ) : enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(course => (
              <Link
                to={`/student/learn/${course._id}`}
                key={course._id}
                className="rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-md overflow-hidden transition duration-300 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-[0_0_40px_rgba(249,115,22,.18)] flex flex-col group"
              >
                <div className="w-full h-48 overflow-hidden bg-[#15110f]">
                  <img
                    src={course.thumbnail?.url || "https://placehold.co/600x400/18181b/f97316?text=Course"}
                    alt={course.title}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-bold text-xl mb-3 line-clamp-2">{course.title}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/10">
                    <span className="text-sm font-semibold text-orange-400 group-hover:text-orange-300 transition">Continue Learning</span>
                    <BookOpen size={18} className="text-orange-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 py-20 text-center backdrop-blur-md">
            <BookOpen size={48} className="text-orange-500/50 mb-4" />
            <h2 className="text-xl font-bold mb-2">No courses yet</h2>
            <p className="text-white/60 max-w-sm mb-6">You haven't enrolled in any courses yet. Start learning today!</p>
            <Link
              to="/courses"
              className="rounded-xl bg-orange-600 px-6 py-3 font-semibold transition hover:bg-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,.4)]"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
