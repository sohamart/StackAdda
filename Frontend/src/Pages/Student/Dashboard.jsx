import React, { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Trophy,
  Clock,
  ArrowRight,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import API from "../../api/axios";

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);

  const stats = [
    {
      title: "Enrolled Courses",
      value: courses.length,
      icon: <BookOpen size={28} />,
    },
    {
      title: "Completed",
      value: 0,
      icon: <GraduationCap size={28} />,
    },
    {
      title: "Certificates",
      value: 0,
      icon: <Trophy size={28} />,
    },
    {
      title: "Learning Hours",
      value: 0,
      icon: <Clock size={28} />,
    },
  ];

  useEffect(() => {
    API.get("/course/my-courses")
      .then(({ data }) => setCourses(data.courses || []))
      .catch(() => setCourses([]));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background Glow */}

      <div className="absolute -top-20 rounded-t-3xl left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[140px]" />

      <div className="relative z-10 space-y-10">

        {/* Hero */}

        <section
          className="
          rounded-3xl
          border
          border-white/10
          bg-white/[0.05]
          backdrop-blur-3xl
          p-8
          "
        >
          <div className="flex flex-col lg:flex-row justify-between gap-8">

            <div>

              <p className="text-orange-400 font-medium">
                Welcome Back 👋
              </p>

              <h1 className="mt-2 text-4xl font-bold">
                {user?.name}
              </h1>
              <div className="mt-6">

                  <span
                    className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                      user?.isVerified
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {user?.isVerified
                      ? "Verified"
                      : "Pending Verification"}
                  </span>

                </div>
              <p className="mt-3 text-white/60 max-w-xl">
                Continue your learning journey with Stack Adda.
                Explore new courses, track your progress and
                improve your skills every day.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">

                <Link
                  to="/student/profile"
                  className="
                  rounded-xl
                  bg-orange-600
                  px-6
                  py-3
                  font-semibold
                  transition
                  hover:bg-orange-500
                  hover:shadow-[0_0_30px_rgba(249,115,22,.4)]
                  "
                >
                  View Profile
                </Link>

                <Link
                  to={courses.length ? "/student/courses" : "/courses"}
                  className="
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-6
                  py-3
                  transition
                  hover:border-orange-500
                  "
                >
                  Browse Courses
                </Link>

              </div>

            </div>

            <div
              className="
              h-48
              w-48
              rounded-full
              border
              border-orange-500/30
              bg-white/[0.04]
              backdrop-blur-3xl
              flex
              items-center
              justify-center
              self-center
              "
            >
              {user?.profileImage?.url ? (
                <img
                  src={user.profileImage.url}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User
                  size={70}
                  className="text-orange-400"
                />
              )}
            </div>

          </div>
        </section>

        {/* Stats */}

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

          {stats.map((item, index) => (

            <div
              key={index}
              className="
              rounded-3xl
              border
              border-white/10
              bg-white/[0.05]
              backdrop-blur-3xl
              p-6
              transition
              duration-300
              hover:-translate-y-2
              hover:border-orange-500/40
              hover:shadow-[0_0_40px_rgba(249,115,22,.18)]
              "
            >
              <div className="flex justify-between">

                <div>

                  <p className="text-white/60">
                    {item.title}
                  </p>

                  <h2 className="mt-3 text-4xl font-bold">
                    {item.value}
                  </h2>

                </div>

                <div className="text-orange-400">
                  {item.icon}
                </div>

              </div>

            </div>

          ))}

        </section>

        {/* Continue Learning */}

        <section
          className="
          rounded-3xl
          border
          border-orange-500/20
          bg-gradient-to-r
          from-orange-600/20
          to-orange-500/5
          backdrop-blur-3xl
          p-8
          mb-5
          "
        >
          <h2 className="text-2xl font-bold">
            Continue Learning
          </h2>

          <p className="mt-3 text-white/60">
            {courses.length ? `You are enrolled in ${courses.length} course${courses.length > 1 ? "s" : ""}.` : "You haven't enrolled in any course yet."}
          </p>

          <Link
            to="/courses"
            className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-orange-600
            px-6
            py-3
            
            font-semibold
            transition
            hover:bg-orange-500
            "
          >
            {courses.length ? "View My Courses" : "Explore Courses"}

            <ArrowRight size={18} />
          </Link>

        </section>



         
           

               

        

      </div>
    </div>
  );
};

export default Dashboard;
