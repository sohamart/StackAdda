import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  Pencil,
  Trash2,
  Layers,
  Users,
  Star,
  BookOpen,
  IndianRupee,
} from "lucide-react";

import { toast } from "react-toastify";

import API from "../../api/axios";

const CourseCard = ({
  course,
  refreshCourses,
}) => {

  const [loading, setLoading] =
    useState(false);

  const handleDelete = async () => {

    const confirmDelete =
      window.confirm(
        "Delete this course?"
      );

    if (!confirmDelete) return;

    try {

      setLoading(true);

      const { data } =
        await API.delete(
          `/course/course/${course._id}`,
          {
            withCredentials: true,
          }
        );

      toast.success(data.message);

      refreshCourses();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
          "Something went wrong."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl transition duration-300 hover:-translate-y-2 hover:border-orange-500/40">

      {/* Thumbnail */}

      <div className="relative h-52 overflow-hidden">

        <img
          src={course.thumbnail?.url}
          alt={course.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute left-4 top-4">

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              course.accessType ===
              "free"
                ? "bg-green-500 text-white"
                : "bg-orange-500 text-white"
            }`}
          >

            {course.accessType ===
            "free"
              ? "FREE"
              : "PAID"}

          </span>

        </div>

        <div className="absolute right-4 top-4">

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              course.status ===
              "published"
                ? "bg-green-500 text-white"
                : "bg-yellow-500 text-black"
            }`}
          >

            {course.status}

          </span>

        </div>

      </div>

      {/* Body */}

      <div className="space-y-5 p-6">

        <div>

          <h2 className="line-clamp-2 text-xl font-bold text-white">

            {course.title}

          </h2>

          <p className="mt-2 text-sm text-white/60">

            {course.category}

          </p>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-4">

          <div className="flex items-center gap-2 text-white/70">

            <Layers
              size={18}
              className="text-orange-500"
            />

            <span>

              {course.chapters?.length || 0} Chapters

            </span>

          </div>

          <div className="flex items-center gap-2 text-white/70">

            <BookOpen
              size={18}
              className="text-orange-500"
            />

            <span>

              {course.chapters?.reduce(
                (total, chapter) =>
                  total +
                  chapter.lessons.length,
                0
              ) || 0}{" "}
              Lessons

            </span>

          </div>

          <div className="flex items-center gap-2 text-white/70">

            <Users
              size={18}
              className="text-orange-500"
            />

            <span>

              {course.students?.length || 0}

            </span>

          </div>

          <div className="flex items-center gap-2 text-white/70">

            <Star
              size={18}
              className="fill-yellow-400 text-yellow-400"
            />

            <span>

              {course.averageRating?.toFixed(
                1
              ) || "0.0"}

            </span>

          </div>

        </div>

        {/* Price */}

        <div className="flex items-center gap-2 text-2xl font-bold text-orange-400">

          <IndianRupee size={22} />

          {course.price}

        </div>

        {/* Buttons */}

        <div className="grid grid-cols-3 gap-3">

          <Link
            to={`/admin/course/edit/${course._id}`}
            className="flex items-center justify-center rounded-xl border border-orange-500 py-3 text-orange-400 transition hover:bg-orange-500 hover:text-white"
          >

            <Pencil size={18} />

          </Link>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex items-center justify-center rounded-xl border border-red-500 py-3 text-red-400 transition hover:bg-red-500 hover:text-white"
          >

            <Trash2 size={18} />

          </button>

          <Link
            to={`/admin/course/${course._id}`}
            className="flex items-center justify-center rounded-xl border border-blue-500 py-3 text-blue-400 transition hover:bg-blue-500 hover:text-white"
          >

            <Layers size={18} />

          </Link>

        </div>

      </div>

    </div>

  );

};

export default CourseCard;