import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  User,
  ShieldCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DeleteStudentModal from "../../Components/Admin/DeleteStudentModal";
import EditStudentModal from "../../Components/Admin/EditStudentModal";
import SendStudentEmailModal from "../../Components/Admin/SendStudentEmailModal";

const StudentDetails = () => {
  const { id } = useParams();
  const [openDelete, setOpenDelete] = useState(false);
  const [student, setStudent] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openEmail, setOpenEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchStudent = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/admin/student/${id}`, {
        withCredentials: true,
      });
      setStudent(data.student);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Delete ${student.name}?`);
    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);
      const { data } = await API.delete(`/admin/student/${id}`, {
        withCredentials: true,
      });
      toast.success(data.message);
      navigate("/admin/students");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete Failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="mt-5 text-white/60">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex h-[65vh] flex-col items-center justify-center text-center text-white">
        <h1 className="text-2xl font-bold">Profile not found</h1>
        <Link to="/admin/students" className="mt-4 text-orange-400">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            {student.role === "admin" ? "Admin Details" : "Student Details"}
          </h1>
          <p className="mt-2 text-white/50">
            {student.role === "admin" ? "View complete admin profile." : "View complete student profile."}
          </p>
        </div>

        <Link
          to="/admin/students"
          className="
            flex
            items-center
            gap-2
            rounded-2xl
            border
            border-white/10
            bg-white/[0.05]
            px-5
            py-3
            font-medium
            text-white
            transition
            hover:border-orange-500
            hover:bg-orange-500/10
          "
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-md">
        <div className="relative mt-12 px-8 pb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            {/* Left */}
            <div className="flex flex-col items-center gap-5 lg:flex-row">
              <img
                src={
                  student.profileImage?.url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=f97316&color=fff`
                }
                alt=""
                className="
                  h-36
                  w-36
                  rounded-full
                  border-4
                  border-orange-500
                  bg-black
                  object-cover
                "
              />

              <div className="min-w-0 text-center lg:text-left">
                <h2 className="break-words text-2xl font-bold text-white sm:text-3xl">
                  {student.name}
                </h2>
                <p className="mt-2 text-white/50">{student.email}</p>
                <div className="mt-4 flex flex-wrap justify-center lg:justify-start gap-3">
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      student.isVerified
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {student.isVerified ? "Verified" : "Pending"}
                  </span>
                  {student.role === "admin" && (
                    <span className="rounded-full bg-blue-500/20 px-4 py-2 text-sm font-bold text-blue-400 border border-blue-500/20">
                      Admin
                    </span>
                  )}
                  {student.isInstructor && (
                    <span className="rounded-full bg-purple-500/20 px-4 py-2 text-sm font-bold text-purple-400 border border-purple-500/20">
                      Instructor
                    </span>
                  )}
                  {student.showOnHome && (
                    <span className="rounded-full bg-orange-500/20 px-4 py-2 text-sm font-bold text-orange-400 border border-orange-500/20">
                      Home Teammate
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:justify-end">
              <button
                onClick={() => setOpenEmail(true)}
                className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-6 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-500 hover:text-white"
              >
                Send Email
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-3 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
              >
                Delete Profile
              </button>
              <button
                onClick={() => setOpenEdit(true)}
                className="rounded-2xl border border-orange-500/20 bg-orange-500/10 px-6 py-3 font-semibold text-orange-400 transition hover:bg-orange-500 hover:text-white"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Info Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-bold text-white">Bio</h3>
            <p className="mt-3 text-white/70 leading-relaxed">
              {student.bio || "No biography provided."}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-bold text-white">Contact Information</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-orange-400" />
                <span className="text-white/70">{student.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-orange-400" />
                <span className="text-white/70">{student.phone || "Not Added"}</span>
              </div>
              {student.instagram && (
                <div className="flex items-center gap-3">
                  <span className="text-orange-400 font-bold text-xs uppercase">Instagram</span>
                  <span className="text-white/70">{student.instagram}</span>
                </div>
              )}
              {student.telegram && (
                <div className="flex items-center gap-3">
                  <span className="text-orange-400 font-bold text-xs uppercase">Telegram</span>
                  <span className="text-white/70">{student.telegram}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Details Column */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h3 className="text-xl font-bold text-white">Account Details</h3>
            <div className="mt-4 space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Joined</span>
                <span className="text-white font-medium">
                  {new Date(student.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Role</span>
                <span className="text-white uppercase font-bold text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
                  {student.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Instructor Status</span>
                <span className={`font-bold text-xs px-2 py-0.5 rounded ${student.isInstructor ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/40'}`}>
                  {student.isInstructor ? "Published" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditStudentModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        student={student}
        onSuccess={fetchStudent}
      />
      <SendStudentEmailModal
        open={openEmail}
        onClose={() => setOpenEmail(false)}
        student={student}
      />
    </div>
  );
};

export default StudentDetails;
