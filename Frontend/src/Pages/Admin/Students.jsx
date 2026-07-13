import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Users, UserPlus, X, Mail } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/axios";
import StudentTable from "../../Components/Admin/StudentTable";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "", role: "student" });
  const [broadcastData, setBroadcastData] = useState({ subject: "", message: "" });

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await API.get(
        "/admin/students",
        {
          withCredentials: true,
        }
      );

      setStudents(data.students || []);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setRegistering(true);
      await API.post("/admin/student", formData);
      toast.success("Student registered successfully.");
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "", phone: "", role: "student" });
      fetchStudents();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to register student.");
    } finally {
      setRegistering(false);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      setBroadcasting(true);
      const { data } = await API.post("/admin/broadcast", broadcastData);
      toast.success(data.message || "Broadcast email sent successfully.");
      setShowBroadcastModal(false);
      setBroadcastData({ subject: "", message: "" });
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to send broadcast email.");
    } finally {
      setBroadcasting(false);
    }
  };

  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return students;

    return students.filter((student) =>
      `${student.name || ""} ${student.email || ""} ${student.phone || ""}`
        .toLowerCase()
        .includes(value)
    );
  }, [search, students]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="mt-5 text-white/60">
            Loading Students...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-6">

      {/* Header */}

      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Students
          </h1>

          <p className="mt-2 text-white/50">
            Manage all registered students.
          </p>

        </div>

        <div className="flex flex-col sm:flex-row w-full items-center gap-3 lg:w-auto">
          <div className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 lg:w-80">
            <Search size={18} className="text-orange-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/40"
            />
          </div>
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 font-semibold text-white transition hover:bg-white/[0.08]"
          >
            <Mail size={18} />
            Broadcast
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
          >
            <UserPlus size={18} />
            Add Student
          </button>
        </div>

      </div>

      {/* Count */}

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-5">

        <Users className="text-orange-400" />

        <h2 className="text-lg font-semibold text-white">
          Total Students :
          <span className="ml-2 text-orange-400">
            {filteredStudents.length}
          </span>
        </h2>

      </div>

      <StudentTable
        students={filteredStudents}
        refresh={fetchStudents}
      />

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111113] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">Register New User</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-white/10 p-2 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleRegister} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">Full Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">Email Address</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-orange-500"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 font-medium text-white hover:bg-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={registering}
                  className="rounded-xl bg-orange-500 px-6 py-2.5 font-semibold text-white hover:bg-orange-600 disabled:opacity-75"
                >
                  {registering ? "Registering..." : "Register Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111113] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">Broadcast Email to All Students</h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="rounded-xl border border-white/10 p-2 text-white/60 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleBroadcast} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">Email Subject</label>
                <input
                  required
                  value={broadcastData.subject}
                  onChange={(e) => setBroadcastData({ ...broadcastData, subject: e.target.value })}
                  placeholder="Important update..."
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>
              
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">Message</label>
                <textarea
                  required
                  rows={6}
                  value={broadcastData.message}
                  onChange={(e) => setBroadcastData({ ...broadcastData, message: e.target.value })}
                  placeholder="Write your email here..."
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-orange-500 resize-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-5">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 font-medium text-white hover:bg-white/[0.08]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={broadcasting}
                  className="rounded-xl bg-orange-500 px-6 py-2.5 font-semibold text-white hover:bg-orange-600 disabled:opacity-75"
                >
                  {broadcasting ? "Sending..." : "Send Broadcast"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Students;
