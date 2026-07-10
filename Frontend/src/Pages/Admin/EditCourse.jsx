import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Upload,
  Loader2,
} from "lucide-react";

import { toast } from "react-toastify";

import API from "../../api/axios";

const EditCourse = () => {

  const navigate =
    useNavigate();

  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [thumbnail, setThumbnail] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      category: "",
      level: "",
      language: "",
      instructor: "",
      duration: "",
      accessType: "free",
      price: 0,
      featured: false,
      showOnHome: false,
      status: "draft",
    });

  const handleChange = (e) => {

    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

  };

  const handleImage = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setThumbnail(file);

    setPreview(
      URL.createObjectURL(file)
    );

  };
    useEffect(() => {

    const fetchCourse =
      async () => {

        try {

          const { data } =
            await API.get(
              `/course/course/${id}`,
              {
                withCredentials: true,
              }
            );

          const c =
            data.course;

          setForm({
            title: c.title,
            description:
              c.description,
            category:
              c.category,
            level:
              c.level,
            language:
              c.language,
            instructor:
              c.instructor,
            duration:
              c.duration,
            accessType:
              c.accessType,
            price:
              c.price,
            featured:
              c.featured,
            showOnHome:
              c.showOnHome,
            status:
              c.status,
          });

          setPreview(
            c.thumbnail.url
          );

        } catch (err) {

          toast.error(
            "Course not found."
          );

          navigate(
            "/admin/courses"
          );

        } finally {

          setLoading(false);

        }

      };

    fetchCourse();

  }, [id]);
  const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    setSaving(true);

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    const { data } = await API.put(
      `/course/course/${id}`,
      formData,
      {
        withCredentials: true,
      }
    );

    toast.success(data.message);

    navigate("/admin/courses");

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Failed to update course."
    );

  } finally {

    setSaving(false);

  }

};
if (loading) {

  return (

    <div className="flex h-[70vh] items-center justify-center">

      <Loader2
        size={45}
        className="animate-spin text-orange-500"
      />

    </div>

  );

}
return (

  <section className="mx-auto max-w-6xl">

    <button
      onClick={() => navigate(-1)}
      className="mb-8 flex items-center gap-2 text-orange-400"
    >

      <ArrowLeft size={20} />

      Back

    </button>

    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-3xl">

      <h1 className="mb-10 text-3xl font-bold text-white">

        Edit Course

      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        <div>

  <label className="mb-3 block text-sm font-semibold text-white">

    Course Thumbnail

  </label>

  <label className="flex h-64 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-orange-500/40 bg-white/5">

    {preview ? (

      <img
        src={preview}
        alt=""
        className="h-full w-full object-cover"
      />

    ) : (

      <div className="text-center">

        <Upload
          size={45}
          className="mx-auto text-orange-500"
        />

        <p className="mt-4 text-white/70">

          Change Thumbnail

        </p>

      </div>

    )}

    <input
      hidden
      type="file"
      accept="image/*"
      onChange={handleImage}
    />

  </label>

</div>
<div className="grid gap-6 md:grid-cols-2">
    <div className="md:col-span-2">

<label className="mb-2 block text-white">

Course Title

</label>

<input
type="text"
name="title"
value={form.title}
onChange={handleChange}
required
className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white outline-none focus:border-orange-500"
/>

</div>
<div className="md:col-span-2">

<label className="mb-2 block text-white">

Description

</label>

<textarea
rows={6}
name="description"
value={form.description}
onChange={handleChange}
required
className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white outline-none focus:border-orange-500"
/>

</div>
<div>

<label className="mb-2 block text-white">

Category

</label>

<input
type="text"
name="category"
value={form.category}
onChange={handleChange}
className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white"
/>

</div>
<div>

<label className="mb-2 block text-white">

Instructor

</label>

<input
type="text"
name="instructor"
value={form.instructor}
onChange={handleChange}
className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white"
/>

</div>
<div>

<label className="mb-2 block text-white">

Language

</label>

<input
type="text"
name="language"
value={form.language}
onChange={handleChange}
className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white"
/>

</div>
<div>

<label className="mb-2 block text-white">

Duration

</label>

<input
type="text"
name="duration"
value={form.duration}
onChange={handleChange}
className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white"
/>

</div>
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

    <option value="Beginner">
      Beginner
    </option>

    <option value="Intermediate">
      Intermediate
    </option>

    <option value="Advanced">
      Advanced
    </option>

  </select>

</div>
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
{
form.accessType === "paid" && (

<div>

<label className="mb-2 block text-white">

Price

</label>

<input
type="number"
name="price"
value={form.price}
onChange={handleChange}
min={0}
className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white outline-none focus:border-orange-500"
/>

</div>

)
}
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
    disabled={saving}
    className="flex min-w-[220px] items-center justify-center gap-3 rounded-2xl bg-orange-500 px-8 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
  >

    {saving ? (

      <Loader2
        size={22}
        className="animate-spin"
      />

    ) : (

      "Save Changes"

    )}

  </button>

</div>
      </form>

    </div>

  </section>

);

};

export default EditCourse;
