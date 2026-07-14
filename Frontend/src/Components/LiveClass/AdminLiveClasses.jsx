import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Plus, Video, Calendar, Clock, MoreVertical, Play, Square, Pause, Settings, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/axios";

export default function AdminLiveClasses({ courseId, course }) {
  const [liveClasses, setLiveClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassId, setEditingClassId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(null);

  const [streamModalOpen, setStreamModalOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [streamUrl, setStreamUrl] = useState("");

  // Form State
  const [form, setForm] = useState({
    title: "",
    subject: "",
    facultyName: "",
    date: "",
    startTime: "",
    expectedEndTime: "",
    introVideoUrl: "",
    introVideo: null,
    waitingRoomEnabled: true,
    chatEnabled: true,
  });

  const previousIntros = Array.from(
    new Map(
      liveClasses
        .filter((cls) => cls.introVideoUrl && cls.introVideoUrl.trim() !== "")
        .map((cls) => [cls.introVideoUrl, cls.title])
    ).entries()
  );

  const loadClasses = async () => {
    try {
      const res = await API.get(`/live-class/admin/course/${courseId}`);
      setLiveClasses(res.data.liveClasses || []);
    } catch (err) {
      toast.error("Failed to load live classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData();
    formData.append("courseId", courseId);
    Object.keys(form).forEach(key => {
      if (key === "introVideo" && form.introVideo) {
        formData.append("introVideo", form.introVideo);
      } else if (key !== "introVideo") {
        formData.append(key, form[key]);
      }
    });

    try {
      if (form.introVideo) setUploadProgress(0);
      
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && form.introVideo) {
            setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        }
      };

      if (editingClassId) {
        await API.put(`/live-class/admin/${editingClassId}`, formData, config);
        toast.success("Live class updated!");
      } else {
        await API.post("/live-class/admin", formData, config);
        toast.success("Live class created!");
      }
      
      handleCloseModal();
      loadClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${editingClassId ? "update" : "create"} live class`);
      setUploadProgress(null);
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (cls) => {
    setForm({
      title: cls.title,
      subject: cls.subject || "",
      facultyName: cls.facultyName,
      date: format(new Date(cls.date), "yyyy-MM-dd"),
      startTime: cls.startTime,
      expectedEndTime: cls.expectedEndTime,
      introVideoUrl: cls.introVideoUrl || "",
      introVideo: null,
      waitingRoomEnabled: cls.waitingRoomEnabled !== undefined ? cls.waitingRoomEnabled : true,
      chatEnabled: cls.chatEnabled !== undefined ? cls.chatEnabled : true,
    });
    setEditingClassId(cls._id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClassId(null);
    setForm({
      title: "",
      subject: "",
      facultyName: "",
      date: "",
      startTime: "",
      expectedEndTime: "",
      introVideoUrl: "",
      introVideo: null,
      waitingRoomEnabled: true,
      chatEnabled: true,
    });
    setUploadProgress(null);
  };

  const changeStatus = async (id, status) => {
    try {
      await API.patch(`/live-class/admin/${id}/status`, { status });
      toast.success(`Class status changed to ${status}`);
      loadClasses();
    } catch (err) {
      toast.error("Failed to change status");
    }
  };

  const startStream = async () => {
    try {
      await API.patch(`/live-class/admin/${selectedClassId}/start-stream`, { streamUrl });
      toast.success("Stream started successfully!");
      setStreamModalOpen(false);
      setStreamUrl("");
      loadClasses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start stream");
    }
  };

  const deleteClass = async (id) => {
    if (!window.confirm("Are you sure you want to delete this live class?")) return;
    try {
      await API.delete(`/live-class/admin/${id}`);
      toast.success("Deleted successfully");
      loadClasses();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="p-10 text-center text-white/50">Loading live classes...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[.045] p-5 backdrop-blur-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Video className="text-orange-500" /> Live Classes
          </h2>
          <p className="text-sm text-white/50">Manage broadcasts, waiting rooms, and live sessions.</p>
        </div>
        <button
          onClick={() => {
            handleCloseModal();
            setIsModalOpen(true);
          }}
          className="flex w-full md:w-auto items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-600"
        >
          <Plus size={18} /> Schedule Class
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {liveClasses.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-white/15 p-12 text-center text-white/50">
            No live classes scheduled yet.
          </div>
        ) : (
          liveClasses.map((cls) => (
            <div key={cls._id} className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                      cls.status === "Live" ? "border-red-500 bg-red-500/10 text-red-500" :
                      cls.status === "Upcoming" ? "border-blue-500 bg-blue-500/10 text-blue-400" :
                      "border-white/20 bg-white/5 text-white/60"
                    }`}>
                      {cls.status === "Live" && <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}
                      {cls.status}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-white break-words whitespace-normal">{cls.title}</h3>
                    <p className="text-sm text-white/50 break-words">by {cls.facultyName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEditClick(cls)} className="text-white/30 hover:text-blue-400 shrink-0">
                      <Settings size={18} />
                    </button>
                    <button onClick={() => deleteClass(cls._id)} className="text-white/30 hover:text-red-400 shrink-0">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Calendar size={16} className="text-orange-400" />
                    {format(new Date(cls.date), "MMM d, yyyy")}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Clock size={16} className="text-orange-400" />
                    {cls.startTime} - {cls.expectedEndTime}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {cls.status === "Upcoming" && (
                    <button onClick={() => changeStatus(cls._id, "Waiting for Host")} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/20">
                      <Play size={16} /> Open Waiting Room
                    </button>
                  )}
                  {cls.status === "Waiting for Host" && (
                    <button onClick={() => { setSelectedClassId(cls._id); setStreamModalOpen(true); }} className="flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600">
                      <Video size={16} /> Start Broadcast
                    </button>
                  )}
                  {cls.status === "Live" && (
                    <>
                      <button onClick={() => changeStatus(cls._id, "Ended")} className="flex items-center gap-2 rounded-lg bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-500/30">
                        <Square size={16} /> End Class
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111113] p-6 shadow-2xl my-8">
            <h3 className="mb-4 text-2xl font-bold text-white">{editingClassId ? "Edit Live Class" : "Schedule Live Class"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="col-span-2">
                  <label className="mb-1 block text-sm text-white/60">Class Title *</label>
                  <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-orange-500 outline-none" placeholder="e.g. Advanced Data Structures" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-white/60">Subject</label>
                  <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-orange-500 outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-white/60">Faculty Name *</label>
                  <input required value={form.facultyName} onChange={e => setForm({...form, facultyName: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-orange-500 outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-white/60">Date *</label>
                  <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-orange-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-sm text-white/60">Start Time *</label>
                    <input type="time" required value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-orange-500 outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-white/60">End Time *</label>
                    <input type="time" required value={form.expectedEndTime} onChange={e => setForm({...form, expectedEndTime: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-orange-500 outline-none" />
                  </div>
                </div>
                <div className="col-span-2 md:col-span-2 rounded-2xl bg-black/20 p-4 border border-white/5 space-y-4">
                  <label className="block text-sm font-medium text-white/80">Intro Video <span className="text-white/40 font-normal">(Plays in Waiting Room)</span></label>
                  
                  <div className="space-y-3">
                    <select 
                      value={form.introVideoUrl} 
                      onChange={e => setForm({...form, introVideoUrl: e.target.value, introVideo: null})}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-orange-500 outline-none"
                    >
                      <option value="">-- Select from previously used intros --</option>
                      {previousIntros.length > 0 && (
                        <optgroup label="Previous Intros" className="bg-zinc-900 text-white">
                          {previousIntros.map(([url, title]) => (
                            <option key={url} value={url}>
                              Used in: {title}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>

                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/10"></div>
                      <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">OR</span>
                      <div className="h-px flex-1 bg-white/10"></div>
                    </div>

                    <input type="url" value={form.introVideoUrl} disabled={Boolean(form.introVideo)} onChange={e => setForm({...form, introVideoUrl: e.target.value})} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-orange-500 outline-none disabled:opacity-40" placeholder="Paste YouTube / External URL" />
                    
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/10"></div>
                      <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">OR</span>
                      <div className="h-px flex-1 bg-white/10"></div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-dashed border-white/20 bg-black/40 hover:border-orange-500 transition-colors">
                      <input type="file" accept="video/mp4" onChange={e => setForm({...form, introVideo: e.target.files[0], introVideoUrl: ""})} className="absolute inset-0 h-full w-full opacity-0 cursor-pointer" />
                      <div className="flex items-center justify-center gap-2 py-3 px-4 text-sm text-white/60">
                        <Video size={18} /> {form.introVideo ? form.introVideo.name : "Upload new MP4 video"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-white/10 pt-4 grid grid-cols-2 gap-4">
                 <label className="flex items-center gap-2 text-white/80">
                   <input type="checkbox" checked={form.waitingRoomEnabled} onChange={e => setForm({...form, waitingRoomEnabled: e.target.checked})} className="accent-orange-500"/>
                   Enable Waiting Room
                 </label>
                 <label className="flex items-center gap-2 text-white/80">
                   <input type="checkbox" checked={form.chatEnabled} onChange={e => setForm({...form, chatEnabled: e.target.checked})} className="accent-orange-500"/>
                   Enable Chat
                 </label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 border-t border-white/10 pt-4 relative">
                {uploadProgress !== null && (
                  <div className="sm:absolute sm:left-0 sm:bottom-0 sm:top-4 sm:right-40 flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-sm font-medium text-orange-400 shrink-0">Uploading: {uploadProgress}%</span>
                    <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                )}
                <button type="button" onClick={handleCloseModal} className="rounded-xl px-5 py-2.5 font-medium text-white hover:bg-white/10 w-full sm:w-auto">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-xl bg-orange-500 px-6 py-2.5 font-medium text-white hover:bg-orange-600 disabled:opacity-50 w-full sm:w-auto">
                  {saving ? "Saving..." : editingClassId ? "Update Class" : "Schedule Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {streamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111113] p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-bold text-white">Start Live Stream</h3>
            <p className="mb-4 text-sm text-white/60">Paste your YouTube Live, Twitch, or Vimeo stream URL below.</p>
            <input 
              type="url" 
              required 
              value={streamUrl} 
              onChange={e => setStreamUrl(e.target.value)} 
              className="w-full mb-6 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:border-orange-500 outline-none" 
              placeholder="https://youtube.com/live/..." 
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => { setStreamModalOpen(false); setStreamUrl(""); }} className="rounded-xl px-5 py-2 font-medium text-white hover:bg-white/10">Cancel</button>
              <button onClick={startStream} disabled={!streamUrl} className="rounded-xl bg-orange-500 px-6 py-2 font-medium text-white hover:bg-orange-600 disabled:opacity-50">Go Live</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
