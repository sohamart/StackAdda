import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  Upload,
  Loader2,
} from "lucide-react";

import { toast } from "react-toastify";

import API from "../../api/axios";

const CreateCourse = () => {

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [thumbnail, setThumbnail] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    language: "English",
    instructor: "",
    duration: "",
    accessType: "free",
    price: 0,
    featured: false,
    showOnHome: false,
    status: "draft",
  });

  const handleChange = (e) => {

    const { name, value, type, checked } =
      e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

  };

  const handleImage = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setThumbnail(file);

    setPreview(
      URL.createObjectURL(file)
    );

  };
    const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const formData =
        new FormData();

      Object.keys(form).forEach((key) => {

        formData.append(
          key,
          form[key]
        );

      });

      if (thumbnail) {

        formData.append(
          "thumbnail",
          thumbnail
        );

      }

      const { data } =
        await API.post(
          "/course/admin/course",
          formData,
          {
            withCredentials: true,
          }
        );

      toast.success(
        data.message
      );

      navigate(`/admin/course/${data.course._id}`);

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

    <section className="mx-auto max-w-6xl">

      <button
        onClick={() =>
          navigate(-1)
        }
        className="mb-8 flex items-center gap-2 text-orange-400"
      >

        <ArrowLeft size={20} />

        Back

      </button>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-3xl">

        <h1 className="mb-10 text-3xl font-bold text-white">

          Create Course

        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

                  {/* Thumbnail */}

          <div>

            <label className="mb-3 block text-sm font-semibold text-white">

              Course Thumbnail

            </label>

            <label className="flex h-64 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-orange-500/40 bg-white/5 transition hover:border-orange-500">

              {preview ? (

                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />

              ) : (

                <div className="text-center">

                  <Upload
                    size={45}
                    className="mx-auto text-orange-500"
                  />

                  <p className="mt-4 text-white/70">

                    Upload Course Thumbnail

                  </p>

                </div>

              )}

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImage}
              />

            </label>

          </div>
          {/* Live Preview */}

<div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-6">

  <h2 className="mb-6 text-xl font-bold text-white">

    Live Preview

  </h2>

  <div className="flex flex-col gap-6 md:flex-row">

    <div className="h-44 w-full overflow-hidden rounded-2xl bg-white/5 md:w-72">

      {preview ? (

        <img
          src={preview}
          alt="Course"
          className="h-full w-full object-cover"
        />

      ) : (

        <div className="flex h-full items-center justify-center text-white/40">

          No Image

        </div>

      )}

    </div>

    <div className="flex flex-1 flex-col justify-between">

      <div>

        <h3 className="text-2xl font-bold text-white">

          {form.title || "Course Title"}

        </h3>

        <p className="mt-3 line-clamp-3 text-white/60">

          {form.description ||
            "Course description will appear here..."}

        </p>

      </div>

      <div className="mt-6 flex flex-wrap gap-3">

        <span className="rounded-full bg-orange-500 px-4 py-2 text-sm text-white">

          {form.category || "Category"}

        </span>

        <span className="rounded-full bg-green-500 px-4 py-2 text-sm text-white">

          {form.level}

        </span>

        <span className="rounded-full bg-blue-500 px-4 py-2 text-sm text-white">

          {form.language}

        </span>

        <span className="rounded-full bg-purple-500 px-4 py-2 text-sm text-white">

          {form.accessType === "free"
            ? "FREE"
            : `₹${form.price || 0}`}

        </span>

      </div>

    </div>

  </div>

</div>

          {/* Grid */}

          <div className="grid gap-6 md:grid-cols-2">

            {/* Title */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-white">

                Course Title

              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="React Masterclass"
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white outline-none transition focus:border-orange-500"
              />
              <div className="mt-2 text-right text-xs text-white/40">

  {form.title.length}/100

</div>

            </div>

            {/* Description */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-white">

                Description

              </label>

              <textarea
                rows="6"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                placeholder="Write course description..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white outline-none transition focus:border-orange-500"
              />
              <div className="mt-2 text-right text-xs text-white/40">

  {form.description.length}/1000

</div>

            </div>

            {/* Category */}

            <div>

              <label className="mb-2 block text-white">

                Category

              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                placeholder="Web Development"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white outline-none transition focus:border-orange-500"
              />

            </div>

            {/* Instructor */}

            <div>

              <label className="mb-2 block text-white">

                Instructor

              </label>

              <input
                type="text"
                name="instructor"
                value={form.instructor}
                onChange={handleChange}
                required
                placeholder="Stack Adda"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white outline-none transition focus:border-orange-500"
              />

            </div>

            {/* Duration */}

            <div>

              <label className="mb-2 block text-white">

                Duration

              </label>

              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="20 Hours"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white outline-none transition focus:border-orange-500"
              />

            </div>

            {/* Language */}

            <div>

              <label className="mb-2 block text-white">

                Language

              </label>

              <input
                type="text"
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white outline-none transition focus:border-orange-500"
              />

            </div>
                        {/* Level */}

            <div>

              <label className="mb-2 block text-white">

                Level

              </label>

              <select
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-5 py-3 text-white outline-none focus:border-orange-500"
              >

                <option>Beginner</option>

                <option>Intermediate</option>

                <option>Advanced</option>

              </select>

            </div>

            {/* Access */}

            <div>

              <label className="mb-2 block text-white">

                Course Type

              </label>

              <select
                name="accessType"
                value={form.accessType}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-5 py-3 text-white outline-none focus:border-orange-500"
              >

                <option value="free">

                  Free

                </option>

                <option value="paid">

                  Paid

                </option>

              </select>

            </div>

            {/* Price */}

            {form.accessType === "paid" && (

              <div>

                <label className="mb-2 block text-white">

                  Price

                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="999"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white outline-none transition focus:border-orange-500"
                />

              </div>

            )}

          </div>
                    <div className="grid gap-5 md:grid-cols-3">

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-white">

              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />

              Featured Course

            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 text-white">

              <input
                type="checkbox"
                name="showOnHome"
                checked={form.showOnHome}
                onChange={handleChange}
              />

              Show On Home

            </label>

            <div>

              <label className="mb-2 block text-white">

                Status

              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-zinc-900 px-5 py-3 text-white outline-none focus:border-orange-500"
              >

                <option value="draft">

                  Draft

                </option>

                <option value="published">

                  Published

                </option>

              </select>

            </div>

          </div>
                    <div className="flex justify-end">

            <button
              type="submit"
              disabled={loading}
              className="flex min-w-[220px] items-center justify-center gap-3 rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (

                <Loader2
                  size={22}
                  className="animate-spin"
                />

              ) : (

                "Create Course & Add Lessons"

              )}

            </button>

          </div>

        </form>

      </div>

    </section>

  );

};

export default CreateCourse;
