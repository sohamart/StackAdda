import React from "react";
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

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Enrolled Courses",
      value: 0,
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

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background Glow */}

      <div className="absolute -top-20 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[140px]" />

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
                  to="/student/courses"
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
          "
        >
          <h2 className="text-2xl font-bold">
            Continue Learning
          </h2>

          <p className="mt-3 text-white/60">
            You haven't enrolled in any course yet.
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
            Explore Courses

            <ArrowRight size={18} />
          </Link>

        </section>

      </div>
    </div>
  );
};

export default Dashboard;