import React, { useEffect, useState } from "react";
import { Search, Users } from "lucide-react";
import API from "../../api/axios";
import StudentTable from "../../Components/Admin/StudentTable";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const { data } = await API.get(
        "/admin/students",
        {
          withCredentials: true,
        }
      );

      setStudents(data.students);
      setFilteredStudents(data.students);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const value = search.toLowerCase();

    setFilteredStudents(
      students.filter((student) =>
        student.name.toLowerCase().includes(value) ||
        student.email.toLowerCase().includes(value) ||
        student.phone?.includes(value)
      )
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
    <div className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-4xl font-bold text-white">
            Students
          </h1>

          <p className="mt-2 text-white/50">
            Manage all registered students.
          </p>

        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3">

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
            className="bg-transparent text-white outline-none placeholder:text-white/40"
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