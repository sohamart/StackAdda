import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileArchive,
  FilePlus2,
  Loader2,
  Link2,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";

import API from "../../api/axios";
import {
  getResourceDownloadUrl,
  getResourceFileName,
} from "../../utils/resourceDownloads";

const initialForm = {
  title: "",
  url: "",
  file: null,
};

export default function ResourceManager() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [selected, setSelected] = useState("");
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await API.get(`/course/course/${id}`);
      setCourse(data.course);
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not load resources.");
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const lessons = useMemo(() => {
    if (!course) return [];

    return course.chapters.flatMap((chapter) =>
      chapter.lessons.map((lesson) => ({
        ...lesson,
        chapterId: chapter._id,
        chapterTitle: chapter.title,
      }))
    );
  }, [course]);

  const lesson = lessons.find((item) => item._id === selected);

  const add = async (event) => {
    event.preventDefault();

    if (!lesson) return toast.error("Select a lesson.");
    if (!form.file && !form.url) {
      return toast.error("Upload a file or add an external URL.");
    }

    try {
      setSaving(true);

      const data = new FormData();
      data.append("title", form.title.trim());

      if (form.file) {
        data.append("resource", form.file);
      } else {
        data.append("url", form.url.trim());
      }

      await API.post(
        `/course/course/${id}/chapter/${lesson.chapterId}/lesson/${lesson._id}/resource`,
        data
      );

      toast.success("Resource added.");
      setForm(initialForm);
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not add resource.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (resource) => {
    if (!lesson || !window.confirm("Delete this resource?")) return;

    try {
      await API.delete(
        `/course/course/${id}/chapter/${lesson.chapterId}/lesson/${lesson._id}/resource/${resource._id}`
      );
      toast.success("Resource deleted.");
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not delete resource.");
    }
  };

  if (!course) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-7 text-white">
      <Link
        to={`/admin/course/${id}`}
        className="inline-flex items-center gap-2 text-orange-400"
      >
        <ArrowLeft size={18} />
        Back to course builder
      </Link>

      <div>
        <p className="text-sm font-semibold tracking-[.2em] text-orange-400">
          COURSE MATERIALS
        </p>
        <h1 className="mt-2 break-words text-3xl font-bold">
          Resources for {course.title}
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <form
          onSubmit={add}
          className="h-fit rounded-3xl border border-white/10 bg-white/[.045] p-5 sm:p-6"
        >
          <h2 className="flex items-center gap-2 font-semibold">
            <FilePlus2 className="text-orange-400" />
            Add resource
          </h2>

          <label className="mt-5 block text-sm text-white/60">Lesson</label>
          <select
            required
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-900 p-3 text-white outline-none focus:border-orange-500"
          >
            <option value="">Choose lesson</option>
            {lessons.map((item) => (
              <option key={item._id} value={item._id}>
                {item.chapterTitle} - {item.title}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-sm text-white/60">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Chapter notes"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-white outline-none focus:border-orange-500"
          />

          <label className="mt-4 block text-sm text-white/60">
            External URL
          </label>
          <div className="relative">
            <Link2
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400"
            />
            <input
              type="url"
              disabled={Boolean(form.file)}
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 pl-10 text-white outline-none focus:border-orange-500 disabled:opacity-40"
            />
          </div>

          <label className="mt-4 flex cursor-pointer flex-col gap-2 rounded-xl border border-dashed border-white/20 p-4 text-sm text-white/60 transition hover:border-orange-500/60 hover:text-white">
            <span className="flex items-center gap-2">
              <Upload size={17} />
              Upload PDF, DOC, TXT or ZIP
            </span>
            <span className="truncate text-orange-300">
              {form.file?.name || "No file selected"}
            </span>
            <input
              hidden
              type="file"
              accept=".pdf,.doc,.docx,.txt,.zip"
              onChange={(e) =>
                setForm({
                  ...form,
                  file: e.target.files?.[0] || null,
                  url: "",
                })
              }
            />
          </label>

          {form.file && (
            <button
              type="button"
              onClick={() => setForm({ ...form, file: null })}
              className="mt-2 text-sm text-white/50 hover:text-white"
            >
              Clear selected file
            </button>
          )}

          <button
            disabled={saving}
            className="mt-5 w-full rounded-xl bg-orange-500 py-3 font-medium transition hover:bg-orange-600 disabled:opacity-60"
          >
            {saving ? "Adding resource..." : "Add resource"}
          </button>
        </form>

        <div className="space-y-3">
          {lesson ? (
            <>
              <div className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
                <p className="text-sm text-orange-200">Selected lesson</p>
                <h2 className="mt-1 break-words font-semibold">
                  {lesson.chapterTitle} - {lesson.title}
                </h2>
              </div>

              {(lesson.resources || []).map((resource) => {
                const fileName = getResourceFileName(resource);
                const downloadUrl = getResourceDownloadUrl({
                  courseId: id,
                  chapterId: lesson.chapterId,
                  lessonId: lesson._id,
                  resourceId: resource._id,
                });

                return (
                  <div
                    key={resource._id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[.045] p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300">
                        <FileArchive size={19} />
                      </div>
                      <div className="min-w-0">
                        <p className="break-words font-medium text-white">
                          {resource.title}
                        </p>
                        <p className="mt-1 truncate text-sm text-white/45">
                          {fileName}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={downloadUrl}
                        download={fileName}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 sm:flex-none"
                      >
                        <Download size={16} />
                        Download
                      </a>
                      <button
                        onClick={() => remove(resource)}
                        className="inline-flex items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-3 text-red-300 transition hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {!lesson.resources?.length && (
                <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/45">
                  No resources for this lesson.
                </p>
              )}
            </>
          ) : (
            <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-white/45">
              Select a lesson to manage its resources.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
