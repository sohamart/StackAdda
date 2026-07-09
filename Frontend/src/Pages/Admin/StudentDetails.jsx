import React, { useEffect, useState } from "react";
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
import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const StudentDetails = () => {

  const { id } = useParams();

  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

const [deleteLoading, setDeleteLoading] =
  useState(false);

  useEffect(() => {

    fetchStudent();

  }, []);

  const fetchStudent = async () => {

    try {

      setLoading(true);

      const { data } = await API.get(
        `/admin/student/${id}`,
        {
          withCredentials: true,
        }
      );

      setStudent(data.student);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };
  const handleDelete = async () => {

  const confirmDelete = window.confirm(
    `Delete ${student.name}?`
  );

  if (!confirmDelete) return;

  try {

    setDeleteLoading(true);

    const { data } = await API.delete(
      `/admin/student/${id}`,
      {
        withCredentials: true,
      }
    );

    toast.success(data.message);

    navigate("/admin/students");

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Delete Failed"
    );

  } finally {

    setDeleteLoading(false);

  }

};

  if (loading) {
    return (
      <div className="flex h-[75vh] items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />

          <p className="mt-5 text-white/60">
            Loading Student...
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
            Student Details
          </h1>

          <p className="mt-2 text-white/50">
            View complete student profile.
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

      {/* Profile */}

      <div
        className="
relative
overflow-hidden
rounded-3xl
border
border-white/10
bg-white/[0.05]
backdrop-blur-3xl
"
      >

        {/* Glow */}

        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-orange-500/10 blur-[120px]" />

        {/* Cover */}

        <div className="h-40 bg-gradient-to-r from-orange-600/40 via-orange-500/20 to-transparent" />

        <div className="relative -mt-16 px-8 pb-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            {/* Left */}

            <div className="flex flex-col items-center gap-5 lg:flex-row">

              <img
                src={
                  student.profileImage?.url ||
                  `https://ui-avatars.com/api/?name=${student.name}&background=f97316&color=fff`
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

              <div>

                <h2 className="text-3xl font-bold text-white">
                  {student.name}
                </h2>

                <p className="mt-2 text-white/50">
                  {student.email}
                </p>

                <div className="mt-4 flex flex-wrap gap-3">

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
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

            <div className="flex gap-3">

              <button
                className="
rounded-2xl
border
border-orange-500/20
bg-orange-500/10
px-6
py-3
font-medium
text-orange-400
transition
hover:bg-orange-500
hover:text-white
"
              >
                Edit Student
              </button>

              <button
  onClick={handleDelete}
  disabled={deleteLoading}
  className="
rounded-2xl
border
border-red-500/20
bg-red-500/10
px-6
py-3
font-medium
text-red-400
transition
hover:bg-red-500
hover:text-white
disabled:opacity-50
"
>
  {deleteLoading ? "Deleting..." : "Delete"}
</button>

            </div>

          </div>

        </div>

      </div>

      {/* Information */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Email */}

        <div
          className="
rounded-3xl
border
border-white/10
bg-white/[0.05]
p-6
backdrop-blur-3xl
"
        >

          <div className="flex items-center gap-3 text-orange-400">

            <Mail size={20} />

            <span>Email Address</span>

          </div>

          <p className="mt-4 break-all text-lg text-white">
            {student.email}
          </p>

        </div>

        {/* Phone */}

        <div
          className="
rounded-3xl
border
border-white/10
bg-white/[0.05]
p-6
backdrop-blur-3xl
"
        >

          <div className="flex items-center gap-3 text-orange-400">

            <Phone size={20} />

            <span>Phone Number</span>

          </div>

          <p className="mt-4 text-lg text-white">
            {student.phone || "Not Added"}
          </p>

        </div>

        {/* Role */}

        <div
          className="
rounded-3xl
border
border-white/10
bg-white/[0.05]
p-6
backdrop-blur-3xl
"
        >

          <div className="flex items-center gap-3 text-orange-400">

            <User size={20} />

            <span>Role</span>

          </div>

          <p className="mt-4 text-lg capitalize text-white">
            {student.role}
          </p>

        </div>

        {/* Joined */}

        <div
          className="
rounded-3xl
border
border-white/10
bg-white/[0.05]
p-6
backdrop-blur-3xl
"
        >

          <div className="flex items-center gap-3 text-orange-400">

            <Calendar size={20} />

            <span>Joined On</span>

          </div>

          <p className="mt-4 text-lg text-white">
            {new Date(student.createdAt).toLocaleDateString()}
          </p>

        </div>

        {/* Bio */}

        <div
          className="
rounded-3xl
border
border-white/10
bg-white/[0.05]
p-6
backdrop-blur-3xl
lg:col-span-2
"
        >

          <div className="flex items-center gap-3 text-orange-400">

            <ShieldCheck size={20} />

            <span>Bio</span>

          </div>

          <p className="mt-4 leading-7 text-white/80">
            {student.bio || "No bio available."}
          </p>

        </div>

      </div>
          </div>
  );
};

export default StudentDetails;