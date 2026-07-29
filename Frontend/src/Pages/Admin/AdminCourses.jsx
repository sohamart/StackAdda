import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import API from "../../api/axios";
import { Loader2, Trash2, Edit, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await API.get("/course/courses");
      if (data.success) {
        setCourses(data.courses || []);
      }
    } catch (err) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entire course? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      const { data } = await API.delete(`/course/course/${id}`);
      if (data.success) {
        toast.success("Course deleted successfully");
        setCourses(courses.filter((c) => c._id !== id));
      }
    } catch (err) {
      toast.error("Failed to delete course");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <BookOpen className="text-orange-500" /> Manage Courses
          </h1>
          <p className="text-white/50 mt-1">View, edit, or delete the courses you have built.</p>
        </div>
        <Link 
          to="/admin/course-builder"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-orange-500/20"
        >
          Build New Course
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {courses.length === 0 ? (
          <div className="p-10 text-center text-white/50">
            No courses found. Start by building one!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/[0.02] border-b border-white/10 text-white/60 text-sm">
                <tr>
                  <th className="p-4 font-semibold">Course Details</th>
                  <th className="p-4 font-semibold">Category & Level</th>
                  <th className="p-4 font-semibold">Access</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {courses.map(course => (
                  <tr key={course._id} className="hover:bg-white/[0.02] transition">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={course.thumbnail?.url || "https://placehold.co/100x60/111/fff?text=No+Img"} 
                          alt="Thumbnail" 
                          className="w-24 h-14 object-cover rounded-lg border border-white/10"
                        />
                        <div>
                          <p className="font-bold text-white line-clamp-1">{course.title}</p>
                          <p className="text-xs text-white/50">{course.chapters?.length || 0} Chapters</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="block text-sm">{course.category}</span>
                      <span className="text-xs text-white/40">{course.level}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${course.accessType === 'free' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                        {course.accessType}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => deleteCourse(course._id)}
                          disabled={deletingId === course._id}
                          className="p-2 text-white/40 hover:text-red-500 hover:bg-white/5 rounded-lg transition"
                          title="Delete Course"
                        >
                          {deletingId === course._id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
