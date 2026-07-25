import {
  Eye,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const StudentTable = ({ students, onToggleRole }) => {
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
            p-4
            sm:p-6
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-orange-500/30
            hover:shadow-[0_0_40px_rgba(249,115,22,.12)]
          "
        >
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left */}
            <div className="flex items-start gap-4 sm:items-center sm:gap-5">
              <img
                src={
                  student.profileImage?.url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=f97316&color=fff`
                }
                alt=""
                className="
                  h-16
                  w-16
                  sm:h-20
                  sm:w-20
                  rounded-full
                  border-2
                  border-orange-500
                  object-cover
                "
              />

              <div>
                <h2 className="break-words text-xl font-bold text-white sm:text-2xl">
                  {student.name}
                </h2>

                <p className="mt-1 text-white/40 font-mono text-xs">
                  ID: #{student._id.slice(-6)}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      student.isVerified
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {student.isVerified ? "Verified" : "Pending"}
                  </span>

                  {student.role === "admin" && (
                    <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-400 border border-blue-500/20">
                      Admin
                    </span>
                  )}

                  {student.isInstructor && (
                    <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-400 border border-purple-500/20">
                      Instructor
                    </span>
                  )}

                  {student.showOnHome && (
                    <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-400 border border-orange-500/20">
                      Home Teammate
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right details */}
            <div className="grid min-w-0 flex-1 gap-4 md:grid-cols-3">
              {/* Email */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-orange-400">
                  <Mail size={18} />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="mt-3 break-all text-white/50 text-sm">
                  {student.email}
                </p>
              </div>

              {/* Phone */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-orange-400">
                  <Phone size={18} />
                  <span className="text-sm font-medium">Phone</span>
                </div>
                <p className="mt-3 text-white/50 text-sm">
                  {student.phone || "Not Added"}
                </p>
              </div>

              {/* Joined */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-orange-400">
                  <Calendar size={18} />
                  <span className="text-sm font-medium">Joined</span>
                </div>
                <p className="mt-3 text-white/50 text-sm">
                  {new Date(student.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 lg:w-[260px] shrink-0">
              <Link
                to={`/admin/student/${student._id}`}
                className="
                  group
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-blue-500/20
                  bg-blue-500/10
                  px-5
                  py-3
                  font-semibold
                  text-blue-400
                  transition-all
                  duration-300
                  hover:bg-blue-500
                  hover:text-white
                  w-full
                  sm:w-auto
                  text-center
                "
              >
                <Eye size={18} className="transition group-hover:scale-110" />
                View
              </Link>

              {onToggleRole && (
                <button
                  onClick={() => onToggleRole(student)}
                  className={`
                    flex
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    border
                    px-5
                    py-3
                    font-semibold
                    transition-all
                    duration-300
                    w-full
                    sm:w-auto
                    cursor-pointer
                    ${student.role === "admin"
                      ? "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                      : "border-green-500/20 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white"
                    }
                  `}
                >
                  {student.role === "admin" ? "Demote" : "Promote"}
                </button>
              )}
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
          <ShieldCheck size={55} className="mx-auto text-orange-400" />
          <h2 className="mt-5 text-2xl font-bold text-white">No Accounts Found</h2>
          <p className="mt-2 text-white/50">
            Accounts will appear here once registered or synced.
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentTable;
