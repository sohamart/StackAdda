import React from "react";
import { Eye, Users } from "lucide-react";
import { Link } from "react-router-dom";

const RecentStudents = ({ students = [] }) => {
  return (
    <div
      className="
rounded-3xl
border
border-white/10
bg-white/[0.05]
backdrop-blur-3xl
p-6
"
    >
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-bold text-white">
            Recent Students
          </h2>

          <p className="mt-1 text-white/50">
            Latest registered students
          </p>

        </div>

        <Link
          to="/admin/students"
          className="
rounded-xl
border
border-orange-500/20
bg-orange-500/10
px-4
py-2
text-sm
text-orange-400
transition
hover:bg-orange-500
hover:text-white
"
        >
          View All
        </Link>

      </div>

      {/* Students */}

      <div className="space-y-4">

        {students.length === 0 ? (

          <div className="py-12 text-center">

            <Users
              size={50}
              className="mx-auto text-white/20"
            />

            <h3 className="mt-4 text-lg font-semibold text-white">
              No Students Found
            </h3>

            <p className="mt-2 text-white/40">
              Students will appear here.
            </p>

          </div>

        ) : (

          students.map((student) => (

            <div
              key={student._id}
              className="
group
flex
flex-col
gap-4
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-5
transition-all
duration-300
hover:border-orange-500/40
hover:bg-white/[0.05]
md:flex-row
md:items-center
md:justify-between
"
            >

              {/* Left */}

              <div className="flex items-center gap-4">

                <img
                  src={
                    student.profileImage?.url ||
                    `https://ui-avatars.com/api/?name=${student.name}&background=f97316&color=fff`
                  }
                  alt={student.name}
                  className="h-16 w-16 rounded-full border-2 border-orange-500 object-cover"
                />

                <div>

                  <h3 className="text-lg font-semibold text-white">
                    {student.name}
                  </h3>

                  <p className="text-sm text-white/50">
                    {student.email}
                  </p>

                  <p className="mt-1 text-xs text-white/40">
                    {student.phone || "No Phone"}
                  </p>

                </div>

              </div>

              {/* Right */}

              <div className="flex flex-wrap items-center gap-3">

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    student.isVerified
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {student.isVerified
                    ? "Verified"
                    : "Pending"}
                </span>

                <span className="text-sm text-white/40">
                  {new Date(
                    student.createdAt
                  ).toLocaleDateString()}
                </span>

                <Link
                  to={`/admin/student/${student._id}`}
                  className="
flex
items-center
gap-2
rounded-xl
bg-orange-500
px-4
py-2
font-medium
text-white
transition
hover:bg-orange-600
"
                >
                  <Eye size={16} />

                  View

                </Link>

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
};

export default RecentStudents;