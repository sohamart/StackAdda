import { useEffect, useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/axios";
import { Link } from "react-router-dom";

export default function MyCourses() {
  const [courses, setCourses] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { API.get("/course/my-courses").then(({data}) => setCourses(data.courses || [])).catch((e) => toast.error(e.response?.data?.message || "Could not load your courses.")).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="animate-spin text-orange-500" size={44}/></div>;
  return <section className="space-y-7 text-white"><div><p className="text-orange-400">MY LEARNING</p><h1 className="mt-1 text-3xl font-bold">My Courses</h1><p className="mt-2 text-white/55">All the courses assigned or purchased for your account.</p></div><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{courses.map((course) => <article key={course._id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.045] backdrop-blur-2xl"><img src={course.thumbnail?.url || "https://placehold.co/800x450/18181b/f97316?text=Stack+Adda"} alt="" className="h-44 w-full object-cover"/><div className="p-5"><p className="text-sm text-orange-300">{course.category}</p><h2 className="mt-2 text-xl font-semibold">{course.title}</h2><p className="mt-2 text-sm text-white/50">{course.chapters?.length || 0} chapters · {course.duration || "Self paced"}</p><Link to={`/student/course/${course._id}`} className="mt-5 inline-flex rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600">Continue learning</Link></div></article>)}{!courses.length && <div className="col-span-full rounded-3xl border border-dashed border-white/15 p-16 text-center text-white/50"><BookOpen className="mx-auto text-orange-400" size={42}/><p className="mt-4">You have no courses yet.</p></div>}</div></section>;
}
