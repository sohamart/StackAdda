import React from 'react'

const Courses = () => {
    const courses = [
  {
    title: "HTML Advanced Course",
    description:
      "Learn HTML from scratch and build beautiful websites.",
    image: "https://....",
    instructor: "Stack Adda",
    category: "Frontend",
    badge: "Bestseller",
    lessons: 35,
    duration: "8 Hours",
    rating: 4.9,
    price: 999,
    oldPrice: 2999,
    showOnHome: true
  },
  {
    title: "CSS Advanced Course",
    description:
      "Master CSS with modern layouts and animations.",
    image: "https://....",
    instructor: "Stack Adda",
    category: "Frontend",
    badge: "Low Price",
    lessons: 42,
    duration: "10 Hours",
    rating: 4.8,
    price: 1199,
    oldPrice: 2999,
    showOnHome: true
  },
  {
    title: "JavaScript Advanced Course",
    description:
      "Become a JavaScript developer from beginner to advanced.",
    image: "https://....",
    instructor: "Stack Adda",
    category: "JavaScript",
    badge: "Trending",
    lessons: 60,
    duration: "15 Hours",
    rating: 5,
    price: 1999,
    oldPrice: 3999,
    showOnHome: false
  }
]
  return (
    <>
    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
  {courses.map((course) => (
    <div
      key={course._id}
      className="group relative overflow-hidden rounded-3xl border border-orange-500/20 bg-white/[0.04] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-[0_0_40px_rgba(249,115,22,.18)]"
    >
      <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-orange-500/20 blur-[80px]" />

      <div className="relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="h-48 sm:h-52 lg:h-56 w-full object-cover transition duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        <span className="absolute left-4 top-4 rounded-full border border-orange-400/30 bg-orange-500/20 px-4 py-1 text-xs font-semibold uppercase text-orange-300 backdrop-blur-xl">
          {course.badge}
        </span>
      </div>

      <div className="p-5">
        <h2 className="text-2xl font-bold text-white">
          {course.title}
        </h2>

        <p className="mt-2 text-sm text-white/60 leading-6">
          {course.description}
        </p>

        <div className="mt-3 flex justify-between text-sm text-white/60">
          <span>📚 {course.lessons}+ Lessons</span>
          <span>⏱️ {course.duration}</span>
        </div>

        <div className="mt-3 flex justify-between text-sm text-white/60">
          <span className="uppercase font-semibold text-white">
            👨‍🏫 {course.instructor}
          </span>

          <span>⭐ {course.rating}</span>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-orange-400">
              ₹{course.price}
            </h3>

            <p className="line-through text-sm text-white/40">
              ₹{course.oldPrice}
            </p>
          </div>

          <button className="rounded-xl bg-orange-600 px-5 py-3 text-white hover:bg-orange-500">
            Enroll →
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
    </>
  )
}

export default Courses
