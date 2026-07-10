import { useEffect, useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/axios";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    API.get("/course/all")
      .then(({ data }) => setCourses(data.courses || []))
      .catch((error) => toast.error(error.response?.data?.message || "Could not load courses."))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#09090B]"><Loader2 className="animate-spin text-orange-500" size={45}/></div>;
  return <main className="min-h-screen bg-[#09090B] px-5 pb-12 pt-32 text-white md:px-10"><div className="mx-auto max-w-7xl"><p className="font-medium text-orange-400">EXPLORE STACK ADDA</p><h1 className="mt-2 text-4xl font-bold">Build skills that move you forward.</h1><div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{courses.map((course) => <article key={course._id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.045] backdrop-blur-2xl"><img src={course.thumbnail?.url || "https://placehold.co/800x450/18181b/f97316?text=Stack+Adda"} alt="" className="h-48 w-full object-cover"/><div className="p-6"><div className="flex justify-between gap-3"><span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs text-orange-300">{course.category}</span><span className="text-sm text-white/55">{course.level}</span></div><h2 className="mt-4 text-xl font-bold">{course.title}</h2><p className="mt-2 line-clamp-2 text-sm text-white/55">{course.description}</p><div className="mt-5 flex items-center justify-between"><span className="font-semibold text-orange-300">{course.accessType === "free" ? "Free" : `₹${course.price}`}</span><Link to={`/courses/${course.slug}`} className="text-sm font-medium text-orange-300 hover:text-orange-200">View course →</Link></div></div></article>)}{!courses.length && <div className="col-span-full rounded-3xl border border-dashed border-white/15 p-16 text-center text-white/50"><BookOpen className="mx-auto text-orange-400" size={42}/><p className="mt-4">No published courses yet.</p></div>}</div></div></main>;
};
export default Courses;
