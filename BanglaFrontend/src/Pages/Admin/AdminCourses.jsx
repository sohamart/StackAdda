import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../api/axios";
import { Loader2, Trash2, Edit, BookOpen, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  
  const [editingCourse, setEditingCourse] = useState(null);
  const [saving, setSaving] = useState(false);

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

  const saveEdit = async () => {
    if(!editingCourse.title) return toast.error("Title is required");
    setSaving(true);
    try {
      const payload = {
        id: editingCourse._id,
        title: editingCourse.title,
        description: editingCourse.description,
        category: editingCourse.category,
        accessType: editingCourse.accessType,
        status: editingCourse.status,
      };
      const { data } = await API.post(`/course/admin/course/bulk`, payload);
      if (data.success) {
        toast.success("Course updated successfully");
        setCourses(courses.map(c => c._id === editingCourse._id ? data.course : c));
        setEditingCourse(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update course");
    } finally {
      setSaving(false);
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
    <div className="p-6 md:p-10 relative">
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
                  <th className="p-4 font-semibold">Status / Access</th>
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
                      <span className="block text-sm font-semibold">{course.category}</span>
                      <span className="text-xs text-white/40">{course.level}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${course.status === 'published' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/10 text-white/50'}`}>
                          {course.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${course.accessType === 'free' ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                          {course.accessType}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditingCourse(course)}
                          className="p-2 text-white/40 hover:text-orange-500 hover:bg-white/5 rounded-lg transition"
                          title="Edit Course"
                        >
                          <Edit size={18} />
                        </button>
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

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-white/10 bg-white/5">
              <h2 className="text-xl font-bold text-white">Edit Course Details</h2>
              <button onClick={() => setEditingCourse(null)} className="text-white/50 hover:text-white transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-white/70 mb-1 block">Course Title</label>
                <input 
                  value={editingCourse.title}
                  onChange={e => setEditingCourse({...editingCourse, title: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-white/70 mb-1 block">Description</label>
                <textarea 
                  value={editingCourse.description}
                  onChange={e => setEditingCourse({...editingCourse, description: e.target.value})}
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-white/70 mb-1 block">Category</label>
                  <input 
                    value={editingCourse.category}
                    onChange={e => setEditingCourse({...editingCourse, category: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-white/70 mb-1 block">Access Type</label>
                  <select 
                    value={editingCourse.accessType}
                    onChange={e => setEditingCourse({...editingCourse, accessType: e.target.value})}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-white/70 mb-1 block">Status</label>
                <select 
                  value={editingCourse.status}
                  onChange={e => setEditingCourse({...editingCourse, status: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            
            <div className="p-5 border-t border-white/10 flex justify-end gap-3 bg-white/5">
              <button onClick={() => setEditingCourse(null)} className="px-5 py-2 rounded-xl text-white/70 hover:bg-white/10 font-bold transition">Cancel</button>
              <button 
                onClick={saveEdit} 
                disabled={saving}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition flex items-center gap-2"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
