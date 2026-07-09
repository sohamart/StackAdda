import React from "react";
import {
  Eye,
  Trash2,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const StudentTable = ({ students }) => {
  return (
    <div className="space-y-5 mb-2">

      {students.map((student) => (

        <div
          key={student._id}
          className="
group
relative
overflow-hidden
rounded-3xl
border
border-white/10
bg-white/[0.04]
backdrop-blur-3xl
p-6
transition-all
duration-300
hover:-translate-y-1
hover:border-orange-500/30
hover:shadow-[0_0_40px_rgba(249,115,22,.12)]
"
        >

          {/* Glow */}

          

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}

            <div className="flex items-center gap-5">

              <img
                src={
                  student.profileImage?.url ||
                  `https://ui-avatars.com/api/?name=${student.name}&background=f97316&color=fff`
                }
                alt=""
                className="
h-20
w-20
rounded-full
border-2
border-orange-500
object-cover
"
              />

              <div>

                <h2 className="text-2xl font-bold text-white">
                  {student.name}
                </h2>

                <p className="mt-1 text-white/40">
                  #{student._id.slice(-6)}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">

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

                </div>

              </div>

            </div>
                        {/* Right */}

            <div className="grid flex-1 gap-4 md:grid-cols-3">

              {/* Email */}

              <div
                className="
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-4
"
              >

                <div className="flex items-center gap-2 text-orange-400">

                  <Mail size={18} />

                  <span className="text-sm">
                    Email
                  </span>

                </div>

                <p className="mt-3 break-all text-white/50">
                  {student.email}
                </p>

              </div>

              {/* Phone */}

              <div
                className="
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-4
"
              >

                <div className="flex items-center gap-2 text-orange-400">

                  <Phone size={18} />

                  <span className="text-sm">
                    Phone
                  </span>

                </div>

                <p className="mt-3 text-white/50">
                  {student.phone || "Not Added"}
                </p>

              </div>

              {/* Joined */}

              <div
                className="
rounded-2xl
border
border-white/10
bg-white/[0.03]
p-4
"
              >

                <div className="flex items-center gap-2 text-orange-400">

                  <Calendar size={18} />

                  <span className="text-sm">
                    Joined
                  </span>

                </div>

                <p className="mt-3 text-white/50">
                  {new Date(
                    student.createdAt
                  ).toLocaleDateString()}
                </p>

              </div>

            </div>
                        {/* Actions */}

            <div
              className="
flex
flex-wrap
items-center
justify-end
gap-3
lg:w-[220px]
"
            >

              <Link
                to={`/admin/student/${student._id}`}
                className="
group
flex
items-center
gap-2
rounded-2xl
border
border-blue-500/20
bg-blue-500/10
px-5
py-3
font-medium
text-blue-400
transition-all
duration-300
hover:bg-blue-500
hover:text-white
"
              >
                <Eye
                  size={18}
                  className="transition group-hover:scale-110"
                />

                View

              </Link>

              <button
                className="
group
flex
items-center
gap-2
rounded-2xl
border
border-red-500/20
bg-red-500/10
px-5
py-3
font-medium
text-red-400
transition-all
duration-300
hover:bg-red-500
hover:text-white
"
              >
                <Trash2
                  size={18}
                  className="transition group-hover:scale-110"
                />

                Delete

              </button>

            </div>

          </div>

        </div>

      ))}

      {students.length === 0 && (

        <div
          className="
rounded-3xl
border
border-dashed
border-white/10
bg-white/[0.03]
py-16
text-center
"
        >

          <ShieldCheck
            size={55}
            className="mx-auto text-orange-400"
          />

          <h2 className="mt-5 text-2xl font-bold text-white">
            No Students Found
          </h2>

          <p className="mt-2 text-white/50">
            Students will appear here after registration.
          </p>

        </div>

      )}

    </div>
  );
};

export default StudentTable;