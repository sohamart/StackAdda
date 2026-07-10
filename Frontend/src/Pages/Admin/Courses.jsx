import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Loader2,
} from "lucide-react";

import API from "../../api/axios";

import CourseCard from "../../Components/Admin/CourseCard";

const Courses = () => {

  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [accessType, setAccessType] = useState("all");

  const fetchCourses = async () => {

    try {

      setLoading(true);

      const { data } = await API.get(
        "/course/courses",
        {
          withCredentials: true,
        }
      );

      setCourses(data.courses || []);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchCourses();

  }, []);
    const filteredCourses = useMemo(() => {

    return courses.filter((course) => {

      const matchesSearch =
        course.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "all"
          ? true
          : course.status === status;

      const matchesAccess =
        accessType === "all"
          ? true
          : course.accessType === accessType;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAccess
      );

    });

  }, [
    courses,
    search,
    status,
    accessType,
  ]);
    if (loading) {

    return (

      <div className="flex h-[70vh] items-center justify-center">

        <div className="text-center">

          <Loader2
            size={45}
            className="mx-auto animate-spin text-orange-500"
          />

          <p className="mt-5 text-white/70">

            Loading Courses...

          </p>

        </div>

      </div>

    );

  }
    return (

    <section className="space-y-8">

      {/* Header */}

      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="flex items-center gap-3 text-3xl font-bold text-white">

            <BookOpen className="text-orange-500" />

            Courses

          </h1>

          <p className="mt-2 text-white/60">

            Manage all Stack Adda courses.

          </p>

        </div>

        <Link
          to="/admin/course/create"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
        >

          <Plus size={20} />

          Create Course

        </Link>

      </div>
            {/* Search & Filters */}

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">

        <div className="grid gap-5 lg:grid-cols-4">

          {/* Search */}

          <div className="relative lg:col-span-2">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            />

            <input
              type="text"
              placeholder="Search course..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white outline-none transition focus:border-orange-500"
            />

          </div>

          {/* Status */}

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-orange-500"
          >

            <option value="all">

              All Status

            </option>

            <option value="draft">

              Draft

            </option>

            <option value="published">

              Published

            </option>

          </select>

          {/* Access */}

          <select
            value={accessType}
            onChange={(e) =>
              setAccessType(e.target.value)
            }
            className="rounded-2xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-orange-500"
          >

            <option value="all">

              All Courses

            </option>

            <option value="free">

              Free

            </option>

            <option value="paid">

              Paid

            </option>

          </select>

        </div>

      </div>
            <div className="grid gap-5 sm:grid-cols-3">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">

          <p className="text-white/60">

            Total Courses

          </p>

          <h2 className="mt-2 text-4xl font-bold text-white">

            {courses.length}

          </h2>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">

          <p className="text-white/60">

            Published

          </p>

          <h2 className="mt-2 text-4xl font-bold text-green-400">

            {
              courses.filter(
                (item) =>
                  item.status === "published"
              ).length
            }

          </h2>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">

          <p className="text-white/60">

            Draft

          </p>

          <h2 className="mt-2 text-4xl font-bold text-yellow-400">

            {
              courses.filter(
                (item) =>
                  item.status === "draft"
              ).length
            }

          </h2>

        </div>

      </div>
            {/* Courses */}

      {filteredCourses.length === 0 ? (

        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 py-20 text-center backdrop-blur-2xl">

          <BookOpen
            size={70}
            className="mx-auto text-orange-500"
          />

          <h2 className="mt-6 text-2xl font-bold text-white">

            No Courses Found

          </h2>

          <p className="mt-3 text-white/60">

            Create your first course to start teaching.

          </p>

          <Link
            to="/admin/course/create"
            className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
          >

            <Plus size={20} />

            Create Course

          </Link>

        </div>

      ) : (

        <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">

          {filteredCourses.map((course) => (

            <CourseCard
              key={course._id}
              course={course}
              refreshCourses={fetchCourses}
            />

          ))}

        </div>

      )}

    </section>

  );

};

export default Courses;