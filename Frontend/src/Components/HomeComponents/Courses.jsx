import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  useEffect(() => { API.get("/course/home").then(({ data }) => setCourses(data.courses || [])).catch(() => setCourses([])); }, []);
  return <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{courses.map((course) => <article key={course._id} className="group overflow-hidden rounded-3xl border border-orange-500/20 bg-white/[.04] backdrop-blur-2xl transition hover:-translate-y-2 hover:border-orange-500/40"><img src={course.thumbnail?.url || "https://placehold.co/800x450/18181b/f97316?text=Stack+Adda"} alt={course.title} className="h-52 w-full object-cover transition group-hover:scale-105"/><div className="p-5"><div className="flex justify-between text-xs"><span className="rounded-full bg-orange-500/15 px-3 py-1 text-orange-300">{course.category}</span><span className="text-white/50">{course.level}</span></div><h2 className="mt-4 text-2xl font-bold text-white">{course.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">{course.description}</p><div className="mt-5 flex items-center justify-between"><span className="text-xl font-bold text-orange-400">{course.accessType === "free" ? "Free" : `₹${course.price}`}</span><Link to={`/courses/${course.slug}`} className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-500">View course</Link></div></div></article>)}{!courses.length && <p className="col-span-full py-10 text-center text-white/50">New courses are coming soon.</p>}</div>;
}
