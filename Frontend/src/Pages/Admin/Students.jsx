import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import API from "../../api/axios";
import StudentTable from "../../Components/Admin/StudentTable";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Students
          </h1>

          <p className="mt-2 text-white/50">
            Manage all registered students.
          </p>

        </div>

        <div className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 lg:max-w-sm">

          <Search
            size={18}
            className="text-orange-400"
          />

          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/40"
          />

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

    </div>
  );
};

export default Students;
