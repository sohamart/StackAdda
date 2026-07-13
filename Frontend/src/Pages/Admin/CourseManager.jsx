import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronRight, Loader2, Plus, Trash2, Upload, Users } from "lucide-react";
import { toast } from "react-toastify";

import API from "../../api/axios";
import { useAuth } from "../../Context/AuthContext";

const emptyChapter = { title: "", description: "" };
const emptyLesson = { title: "", description: "", duration: "", isPreview: false, video: null, videoUrl: "" };

export default function CourseManager() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);

  const [chapterForm, setChapterForm] = useState(emptyChapter);
  const [lessonForms, setLessonForms] = useState({});
  
  const [openChapter, setOpenChapter] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  const load = async () => {
    try {
      const [courseResult, studentResult] = await Promise.all([
        API.get(`/course/course/${id}`),
        API.get("/admin/students"),
      ]);
      setCourse(courseResult.data.course);
      setStudents(studentResult.data.students || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load course management.");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const request = async (action, successMessage) => {
    try { setSaving(true); await action(); toast.success(successMessage); await load(); return true; }
    catch (error) { toast.error(error.response?.data?.message || "Action failed. Please try again."); return false; }
    finally { setSaving(false); }
  };

  // Chapter & Lesson Logic
  const addChapter = async (event) => {
    event.preventDefault();
    const added = await request(() => API.post(`/course/course/${id}/chapter`, chapterForm), "Chapter added successfully.");
    if (added) setChapterForm(emptyChapter);
  };
  
  const addLesson = async (event, chapterId) => {
    event.preventDefault();
    const form = lessonForms[chapterId] || emptyLesson;
    const payload = new FormData();
    ["title", "description", "duration", "isPreview", "videoUrl"].forEach((key) => payload.append(key, form[key]));
    if (form.video) payload.append("video", form.video);
    setUploadProgress(form.video ? 0 : null);
    const added = await request(() => API.post(`/course/course/${id}/chapter/${chapterId}/lesson`, payload, {
      onUploadProgress: (event) => {
        if (event.total) setUploadProgress(Math.round((event.loaded * 100) / event.total));
      },
    }), "Lesson added successfully.");
    setUploadProgress(null);
    if (added) setLessonForms((current) => ({ ...current, [chapterId]: emptyLesson }));
  };

  const deleteChapter = (chapterId) => {
    if (window.confirm("Delete this chapter and every lesson in it?")) request(() => API.delete(`/course/course/${id}/chapter/${chapterId}`), "Chapter deleted.");
  };

  const deleteLesson = (chapterId, lessonId) => {
    if (window.confirm("Delete this lesson?")) request(() => API.delete(`/course/course/${id}/chapter/${chapterId}/lesson/${lessonId}`), "Lesson deleted.");
  };

  const updateChapter = (chapter) => {
    const title = window.prompt("Chapter title", chapter.title);
    if (title && title.trim() !== chapter.title) request(() => API.put(`/course/course/${id}/chapter/${chapter._id}`, { title: title.trim() }), "Chapter updated.");
  };

  const openEditLessonModal = (chapterId, lesson) => {
    setEditingLesson({
      chapterId,
      lessonId: lesson._id,
      title: lesson.title || "",
      description: lesson.description || "",
      duration: lesson.duration || "",
      videoUrl: lesson.video?.url && !lesson.video.public_id ? lesson.video.url : "",
      isPreview: lesson.isPreview || false,
      videoFile: null,
      videoFileName: lesson.video?.url && lesson.video.public_id ? "Uploaded video attached" : ""
    });
  };

  const saveLessonEdit = async (event) => {
    event.preventDefault();
    if (!editingLesson) return;
    const { chapterId, lessonId, title, description, duration, isPreview, videoUrl, videoFile } = editingLesson;
    
    const payload = new FormData();
    payload.append("title", title);
    payload.append("description", description);
    payload.append("duration", duration);
    payload.append("isPreview", isPreview ? "true" : "false");
    
    if (videoFile) {
      payload.append("video", videoFile);
      setUploadProgress(0);
    } else if (videoUrl) {
      payload.append("videoUrl", videoUrl);
    } else {
      payload.append("videoUrl", "");
    }

    const updated = await request(() => API.put(`/course/course/${id}/chapter/${chapterId}/lesson/${lessonId}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (event.total && videoFile) setUploadProgress(Math.round((event.loaded * 100) / event.total));
      },
    }), "Lesson updated successfully.");
    
    setUploadProgress(null);
    if (updated) setEditingLesson(null);
  };

  // Student Logic
  const assignStudent = (event) => {
    event.preventDefault();
    if (!studentId) return toast.error("Select a student first.");
    request(() => API.post("/course/course/assign", { studentId, courseId: id }), "Student assigned to this course.");
    setStudentId("");
  };
  
  const removeStudent = (idToRemove) => request(() => API.delete("/course/course/remove", { data: { studentId: idToRemove, courseId: id } }), "Student removed from course.");



  if (loading) return <div className="flex h-[65vh] items-center justify-center"><Loader2 className="animate-spin text-orange-500" size={46} /></div>;
  if (!course) return <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-red-200">Course could not be found.</div>;
  
  const enrolled = new Set((course.students || []).map((student) => student._id));

  return (
    <section className="mx-auto max-w-7xl space-y-7 pb-10">
      {uploadProgress !== null && (
        <div className="sticky top-24 z-30 overflow-hidden rounded-2xl border border-orange-500/40 bg-[#17100c] p-4 shadow-[0_12px_40px_rgba(0,0,0,.35)]">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-white">Uploading lesson video… please keep this page open</span>
            <span className="text-orange-300">{uploadProgress}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-orange-500 transition-all" style={{ width: `${uploadProgress}%` }}/>
          </div>
        </div>
      )}

      <Link to="/admin/courses" className="inline-flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-300">
        <ArrowLeft size={18}/> All courses
      </Link>

      <header className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.045] p-6 backdrop-blur-2xl md:flex md:items-center md:justify-between">
        <div>
          <p className="text-sm text-orange-400">Course workspace</p>
          <h1 className="mt-1 text-3xl font-bold text-white">{course.title}</h1>
          <p className="mt-2 text-white/55">Build curriculum, manage live classes and control enrolments.</p>
        </div>
        <div className="mt-5 flex flex-col sm:flex-row gap-3 md:mt-0">
          <Link to={`/admin/course/${id}/resources`} className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2.5 font-medium text-white/80 hover:border-orange-500 hover:text-orange-300">Manage resources</Link>
          <Link to={`/admin/course/edit/${id}`} className="inline-flex items-center justify-center rounded-xl border border-orange-500/70 px-4 py-2.5 font-medium text-orange-300 hover:bg-orange-500 hover:text-white">Edit course details</Link>
        </div>
      </header>

      <div className="grid gap-7 xl:grid-cols-[1.65fr_.85fr]">
        <div className="space-y-5">
              <form onSubmit={addChapter} className="rounded-3xl border border-white/10 bg-white/[.045] p-5 backdrop-blur-2xl">
                <h2 className="mb-4 flex items-center gap-2 font-semibold text-white"><Plus className="text-orange-400" size={18}/> Add chapter</h2>
                <div className="grid gap-3 md:grid-cols-[1fr_1.4fr_auto]">
                  <input required value={chapterForm.title} onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })} placeholder="Chapter title" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-500"/>
                  <input value={chapterForm.description} onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })} placeholder="Short description (optional)" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-500"/>
                  <button disabled={saving} className="rounded-xl bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600 disabled:opacity-60">Add</button>
                </div>
              </form>

              {(course.chapters || []).length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/15 p-12 text-center text-white/50">No chapters yet. Start by adding your course curriculum.</div>
              ) : (
                course.chapters.map((chapter, index) => {
                  const isOpen = openChapter === chapter._id; 
                  const form = lessonForms[chapter._id] || emptyLesson;
                  return (
                    <article key={chapter._id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/[.045] backdrop-blur-2xl">
                      <div className="flex items-center gap-3 p-5">
                        <button onClick={() => setOpenChapter(isOpen ? null : chapter._id)} className="text-orange-400">{isOpen ? <ChevronDown/> : <ChevronRight/>}</button>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-orange-400">CHAPTER {index + 1}</p>
                          <h2 className="truncate text-lg font-semibold text-white">{chapter.title}</h2>
                          <p className="text-sm text-white/45">{chapter.lessons?.length || 0} lessons</p>
                        </div>
                        <button onClick={() => updateChapter(chapter)} className="text-sm text-white/50 hover:text-white">Rename</button>
                        <button onClick={() => deleteChapter(chapter._id)} className="text-red-400 hover:text-red-300"><Trash2 size={18}/></button>
                      </div>
                      {isOpen && (
                        <div className="border-t border-white/10 p-5">
                          <div className="space-y-2">
                            {(chapter.lessons || []).map((lesson, lessonIndex) => (
                              <div key={lesson._id} className="flex items-center gap-3 rounded-2xl bg-black/20 px-4 py-3">
                                <span className="text-sm text-orange-400">{lessonIndex + 1}</span>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-medium text-white">{lesson.title}</p>
                                  <p className="text-xs text-white/45">{lesson.duration || "No duration"}{lesson.isPreview ? " · Preview" : ""}{lesson.video?.url ? " · Video attached" : ""}</p>
                                </div>
                                <button onClick={() => openEditLessonModal(chapter._id, lesson)} className="text-sm text-white/50 hover:text-white">Edit</button>
                                <button onClick={() => deleteLesson(chapter._id, lesson._id)} className="text-red-400"><Trash2 size={17}/></button>
                              </div>
                            ))}
                          </div>
                          <form onSubmit={(event) => addLesson(event, chapter._id)} className="mt-4 grid gap-3 rounded-2xl border border-orange-500/20 bg-orange-500/[.04] p-4 md:grid-cols-2">
                            <input required value={form.title} onChange={(e) => setLessonForms({ ...lessonForms, [chapter._id]: { ...form, title: e.target.value } })} placeholder="Lesson title" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-500"/>
                            <input value={form.duration} onChange={(e) => setLessonForms({ ...lessonForms, [chapter._id]: { ...form, duration: e.target.value } })} placeholder="Duration e.g. 12:30" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-500"/>
                            <input value={form.description} onChange={(e) => setLessonForms({ ...lessonForms, [chapter._id]: { ...form, description: e.target.value } })} placeholder="Lesson description" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-500"/>
                            <input type="url" value={form.videoUrl} disabled={Boolean(form.video)} onChange={(e) => setLessonForms({ ...lessonForms, [chapter._id]: { ...form, videoUrl: e.target.value } })} placeholder="Video URL (MP4 or YouTube embed)" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-orange-500 disabled:opacity-40"/>
                            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm text-white/60 hover:border-orange-500"><Upload size={16}/>{form.video?.name || "Or upload video"}<input hidden type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => setLessonForms({ ...lessonForms, [chapter._id]: { ...form, video: e.target.files[0], videoUrl: "" } })}/></label>
                            <label className="flex items-center gap-2 text-sm text-white/70"><input type="checkbox" checked={form.isPreview} onChange={(e) => setLessonForms({ ...lessonForms, [chapter._id]: { ...form, isPreview: e.target.checked } })}/> Free preview</label>
                            <button disabled={saving} className="rounded-xl bg-orange-500 px-4 py-3 font-medium text-white hover:bg-orange-600 disabled:opacity-60">Add lesson</button>
                          </form>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
        </div>

        <aside className="h-fit rounded-3xl border border-white/10 bg-white/[.045] p-5 backdrop-blur-2xl">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white"><Users className="text-orange-400" size={19}/> Enrolled students</h2>
          <p className="mt-1 text-sm text-white/50">{course.students?.length || 0} learners enrolled</p>
          <form onSubmit={assignStudent} className="mt-5 flex gap-2">
            <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-900 px-3 py-2.5 text-sm text-white">
              <option value="">Assign student</option>
              {students.filter((student) => !enrolled.has(student._id)).map((student) => (
                <option key={student._id} value={student._id}>{student.name} · {student.email}</option>
              ))}
            </select>
            <button disabled={saving} className="rounded-xl bg-orange-500 px-3 text-white"><Plus size={19}/></button>
          </form>
          <div className="mt-4 space-y-2">
            {(course.students || []).map((student) => (
              <div key={student._id} className="flex items-center gap-3 rounded-2xl bg-black/20 p-3">
                <img src={student.profileImage?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=f97316&color=fff`} className="h-9 w-9 rounded-full object-cover" alt=""/>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{student.name}</p>
                  <p className="truncate text-xs text-white/45">{student.email}</p>
                </div>
                <button onClick={() => removeStudent(student._id)} className="text-red-400"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-4xl border border-orange-500/20 bg-[#111113] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-2xl font-bold text-white">Edit Lesson Details</h3>
              <button onClick={() => setEditingLesson(null)} className="rounded-xl border border-white/10 p-2 text-white/60 hover:bg-white/10 hover:text-white">Cancel</button>
            </div>
            <form onSubmit={saveLessonEdit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">Lesson Title</label>
                <input required value={editingLesson.title} onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })} placeholder="Enter lesson title" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-orange-500"/>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">Duration (e.g. 12:30)</label>
                  <input value={editingLesson.duration} onChange={(e) => setEditingLesson({ ...editingLesson, duration: e.target.value })} placeholder="Duration" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-orange-500"/>
                </div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
                    <input type="checkbox" checked={editingLesson.isPreview} onChange={(e) => setEditingLesson({ ...editingLesson, isPreview: e.target.checked })} className="h-4 w-4 rounded border border-white/10 bg-black/30 text-orange-500 focus:ring-0"/>
                    Free preview lesson
                  </label>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">Lesson Description</label>
                <textarea rows={3} value={editingLesson.description} onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })} placeholder="Write lesson description..." className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-orange-500 resize-none"/>
              </div>
              <div className="border-t border-white/10 pt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">Video URL</label>
                  <input type="url" value={editingLesson.videoUrl} disabled={Boolean(editingLesson.videoFile)} onChange={(e) => setEditingLesson({ ...editingLesson, videoUrl: e.target.value })} placeholder="URL of the video (MP4 or YouTube embed)" className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-orange-500 disabled:opacity-40"/>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">Or upload new video file</label>
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-white/20 bg-black/20 px-4 py-3 text-sm text-white/60 hover:border-orange-500">
                    <Upload size={16}/>
                    {editingLesson.videoFile?.name || editingLesson.videoFileName || "Select video file"}
                    <input hidden type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(e) => setEditingLesson({ ...editingLesson, videoFile: e.target.files[0], videoUrl: "" })}/>
                  </label>
                </div>
              </div>
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setEditingLesson(null)} className="w-full sm:w-auto rounded-xl border border-white/10 bg-white/[0.04] px-6 py-3 font-medium text-white hover:bg-white/[0.08]">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-orange-500 px-8 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-75">{saving ? "Saving..." : "Save Changes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
