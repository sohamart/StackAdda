import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import API from "../../api/axios";
import { Loader2, GripVertical, Plus, Trash2, ListVideo, PlaySquare, CheckCircle2 } from "lucide-react";

export default function CourseBuilder() {
  const [loading, setLoading] = useState(false);
  
  // Channel Data
  const [channelPlaylists, setChannelPlaylists] = useState([]);
  const [channelVideos, setChannelVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState(new Set());
  const [browserTab, setBrowserTab] = useState("playlists"); // 'playlists' | 'videos'
  const [fetchingData, setFetchingData] = useState(true);

  // Builder State
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [chapters, setChapters] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null); // { cIndex, lIndex, quizData }

  useEffect(() => {
    fetchChannelData();
  }, []);

  const fetchChannelData = async () => {
    setFetchingData(true);
    try {
      const [plRes, vidRes] = await Promise.all([
        API.get("/youtube/fetch-channel-playlists"),
        API.get("/youtube")
      ]);
      if (plRes.data.success) setChannelPlaylists(plRes.data.playlists || []);
      if (vidRes.data.success) setChannelVideos(vidRes.data.videos || []);
    } catch (err) {
      toast.error("Failed to fetch channel data");
    } finally {
      setFetchingData(false);
    }
  };

  const handlePlaylistSelect = async (playlistId) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/youtube/fetch-playlist/${playlistId}`);
      if (!data.success) throw new Error(data.message);
      
      setCourseTitle(data.playlist.title);
      setCourseDesc(data.playlist.description);
      setThumbnailUrl(data.playlist.thumbnailUrl);
      
      setChapters([
        {
          title: "Chapter 1: " + data.playlist.title,
          description: "",
          lessons: data.videos.map((v, i) => ({
            title: v.title,
            description: v.description,
            type: "video",
            video: { url: `https://www.youtube.com/watch?v=${v.videoId}` },
            duration: v.duration,
            isPreview: i === 0,
            quizData: [],
          }))
        }
      ]);
      toast.success("Playlist loaded successfully!");
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } catch (err) {
      toast.error(err.message || "Failed to load playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFromSelectedVideos = () => {
    const selected = channelVideos.filter(v => selectedVideos.has(v._id));
    if (selected.length === 0) return toast.error("Select at least 1 video");

    setCourseTitle(courseTitle || "Custom Video Course");
    if (!thumbnailUrl) setThumbnailUrl(selected[0].thumbnailUrl);
    
    const newLessons = selected.map((v, i) => ({
      title: v.title,
      description: v.description,
      type: "video",
      video: { url: v.link || `https://www.youtube.com/watch?v=${v.videoId}` },
      duration: v.duration,
      isPreview: chapters.length === 0 && i === 0,
      quizData: [],
    }));

    if (chapters.length === 0) {
      setChapters([
        {
          title: "General Content",
          description: "",
          lessons: newLessons
        }
      ]);
    } else {
      const updated = [...chapters];
      updated[updated.length - 1].lessons.push(...newLessons);
      setChapters(updated);
    }
    
    setSelectedVideos(new Set()); // Clear selection
    toast.success("Videos added to course!");
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const toggleVideoSelection = (id) => {
    const next = new Set(selectedVideos);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedVideos(next);
  };

  const setPreview = (chapterIndex, lessonIndex) => {
    const updated = [...chapters];
    updated.forEach(c => c.lessons.forEach(l => l.isPreview = false));
    updated[chapterIndex].lessons[lessonIndex].isPreview = true;
    setChapters(updated);
  };

  const addQuiz = (chapterIndex) => {
    const updated = [...chapters];
    updated[chapterIndex].lessons.push({
      title: "New Quiz",
      description: "Test your knowledge",
      type: "quiz",
      isPreview: false,
      quizData: [
        { question: "Sample Question?", options: ["A", "B", "C"], correctAnswer: 0 }
      ]
    });
    setChapters(updated);
  };

  const removeLesson = (cIndex, lIndex) => {
    const updated = [...chapters];
    updated[cIndex].lessons.splice(lIndex, 1);
    setChapters(updated);
  };

  const saveQuiz = () => {
    const { cIndex, lIndex, quizData } = editingQuiz;
    const updated = [...chapters];
    updated[cIndex].lessons[lIndex].quizData = quizData;
    setChapters(updated);
    setEditingQuiz(null);
  };

  const saveCourse = async () => {
    if (!courseTitle || chapters.length === 0) return toast.error("Course title and chapters are required.");
    setSaving(true);
    try {
      const payload = {
        title: courseTitle,
        description: courseDesc,
        thumbnailUrl,
        chapters,
        status: "published",
      };
      const { data } = await API.post("/course/admin/course/bulk", payload);
      if (data.success) {
        toast.success("Course saved successfully!");
        setChapters([]);
        setCourseTitle("");
        setCourseDesc("");
        setThumbnailUrl("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">YouTube Course Builder</h1>
        <p className="text-white/50 mt-2">Browse your channel and seamlessly convert playlists or videos into courses.</p>
      </div>

      {/* Channel Browser */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        
        {/* Browser Tabs */}
        <div className="flex border-b border-white/10">
          <button 
            onClick={() => setBrowserTab("playlists")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition ${browserTab === "playlists" ? "bg-orange-500/10 text-orange-400 border-b-2 border-orange-500" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
          >
            <ListVideo size={20} /> My Playlists
          </button>
          <button 
            onClick={() => setBrowserTab("videos")}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-bold transition ${browserTab === "videos" ? "bg-orange-500/10 text-orange-400 border-b-2 border-orange-500" : "text-white/50 hover:bg-white/5 hover:text-white"}`}
          >
            <PlaySquare size={20} /> My Videos
          </button>
        </div>

        {/* Browser Content */}
        <div className="p-6">
          {fetchingData ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/50">
              <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
              <p>Fetching your channel data...</p>
            </div>
          ) : (
            <>
              {/* Playlists View */}
              {browserTab === "playlists" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {channelPlaylists.length === 0 ? (
                    <div className="col-span-full py-10 text-center text-white/50 border border-dashed border-white/10 rounded-xl">No playlists found on your channel.</div>
                  ) : (
                    channelPlaylists.map(pl => (
                      <div key={pl.id} className="bg-black/40 border border-white/10 rounded-xl overflow-hidden group hover:border-orange-500/50 transition">
                        <div className="relative">
                          <img src={pl.thumbnailUrl} alt={pl.title} className="w-full aspect-video object-cover" />
                          <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white">
                            <ListVideo size={12} className="inline mr-1"/> {pl.videoCount}
                          </div>
                          {/* Overlay button */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <button 
                              onClick={() => handlePlaylistSelect(pl.id)}
                              disabled={loading}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                            >
                              {loading ? <Loader2 className="animate-spin" size={16} /> : "Import Entire Playlist"}
                            </button>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-white line-clamp-1">{pl.title}</h3>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Videos View */}
              {browserTab === "videos" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-white/60 text-sm">Select videos to build a custom course.</p>
                    {selectedVideos.size > 0 && (
                      <button 
                        onClick={handleCreateFromSelectedVideos}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm shadow-lg shadow-orange-500/20"
                      >
                        Add {selectedVideos.size} Selected to Course
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {channelVideos.length === 0 ? (
                      <div className="col-span-full py-10 text-center text-white/50 border border-dashed border-white/10 rounded-xl">No videos found. Ensure your backend has synced them.</div>
                    ) : (
                      channelVideos.map(v => {
                        const isSelected = selectedVideos.has(v._id);
                        return (
                          <div 
                            key={v._id} 
                            onClick={() => toggleVideoSelection(v._id)}
                            className={`cursor-pointer border rounded-xl overflow-hidden transition relative ${isSelected ? "border-orange-500 bg-orange-500/5" : "border-white/10 bg-black/40 hover:border-white/30"}`}
                          >
                            <div className="relative">
                              <img src={v.thumbnailUrl} alt={v.title} className="w-full aspect-video object-cover" />
                              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold text-white">
                                {v.duration}
                              </div>
                              {isSelected && (
                                <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                                  <div className="bg-orange-500 rounded-full p-1 text-white shadow-xl">
                                    <CheckCircle2 size={24} />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h3 className="font-semibold text-white/90 text-xs line-clamp-2">{v.title}</h3>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>


      {/* Builder UI */}
      {chapters.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-white/10 pt-8 mt-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 sticky top-24">
              <h3 className="font-bold text-white border-b border-white/10 pb-3">Course Details</h3>
              {thumbnailUrl && <img src={thumbnailUrl} alt="Thumbnail" className="w-full rounded-xl aspect-video object-cover" />}
              <input 
                value={courseTitle}
                onChange={e => setCourseTitle(e.target.value)}
                placeholder="Course Title"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-orange-500"
              />
              <textarea 
                value={courseDesc}
                onChange={e => setCourseDesc(e.target.value)}
                placeholder="Course Description"
                rows={5}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none resize-none focus:border-orange-500"
              />
              <button 
                onClick={saveCourse}
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex justify-center items-center shadow-lg shadow-green-600/20"
              >
                {saving ? <Loader2 className="animate-spin" /> : "Save Full Course"}
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-bold text-white text-xl flex items-center gap-2">
              <ListVideo className="text-orange-500" /> Syllabus & Curriculum
            </h3>
            
            {chapters.map((chapter, cIndex) => (
              <div key={cIndex} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <input 
                  value={chapter.title}
                  onChange={e => {
                    const up = [...chapters];
                    up[cIndex].title = e.target.value;
                    setChapters(up);
                  }}
                  className="w-full bg-transparent border-none text-lg font-bold text-orange-400 outline-none mb-4"
                />

                <div className="space-y-3">
                  {chapter.lessons.map((lesson, lIndex) => (
                    <div key={lIndex} className="flex items-center gap-3 bg-black/40 border border-white/10 p-3 rounded-xl group hover:border-white/30 transition">
                      <GripVertical size={16} className="text-white/20 cursor-grab" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${lesson.type === 'video' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                            {lesson.type}
                          </span>
                          <span className="text-sm font-semibold text-white line-clamp-1">{lesson.title}</span>
                        </div>
                      </div>
                      
                      {lesson.type === 'video' && (
                        <button 
                          onClick={() => setPreview(cIndex, lIndex)}
                          className={`text-[10px] uppercase px-3 py-1 rounded-lg font-bold border ${lesson.isPreview ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-white/5 text-white/40 border-white/10 hover:text-white"}`}
                        >
                          {lesson.isPreview ? "Previewing" : "Set Preview"}
                        </button>
                      )}

                      {lesson.type === 'quiz' && (
                        <button 
                          onClick={() => setEditingQuiz({ cIndex, lIndex, quizData: [...(lesson.quizData || [])] })}
                          className="text-[10px] uppercase px-3 py-1 rounded-lg font-bold border bg-white/5 text-white/80 border-white/10 hover:text-white hover:bg-white/10 transition"
                        >
                          Edit Quiz
                        </button>
                      )}

                      <button onClick={() => removeLesson(cIndex, lIndex)} className="text-red-500/50 hover:text-red-500 p-1 bg-white/5 rounded hover:bg-red-500/10 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => addQuiz(cIndex)}
                  className="mt-4 flex items-center gap-2 text-sm text-orange-400 hover:text-orange-300 font-semibold px-4 py-2 bg-orange-500/10 rounded-lg hover:bg-orange-500/20 transition w-full justify-center border border-dashed border-orange-500/30"
                >
                  <Plus size={16} /> Add Quiz to this Chapter
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Quiz Editor Modal */}
      {editingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Edit Quiz</h2>
              <button onClick={() => setEditingQuiz(null)} className="text-white/50 hover:text-white font-bold">Close</button>
            </div>
            
            <div className="space-y-6">
              {editingQuiz.quizData.map((q, qIndex) => (
                <div key={qIndex} className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-orange-400">Question {qIndex + 1}</span>
                    <button 
                      onClick={() => {
                        const up = {...editingQuiz};
                        up.quizData.splice(qIndex, 1);
                        setEditingQuiz(up);
                      }}
                      className="text-red-500/50 hover:text-red-500 p-1"
                    ><Trash2 size={16} /></button>
                  </div>
                  <input 
                    value={q.question}
                    onChange={e => {
                      const up = {...editingQuiz};
                      up.quizData[qIndex].question = e.target.value;
                      setEditingQuiz(up);
                    }}
                    placeholder="Enter question"
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white mb-4 outline-none focus:border-orange-500"
                  />
                  <div className="space-y-3 pl-4 border-l-2 border-white/10">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name={`correct-${qIndex}`}
                          checked={q.correctAnswer === oIndex}
                          onChange={() => {
                            const up = {...editingQuiz};
                            up.quizData[qIndex].correctAnswer = oIndex;
                            setEditingQuiz(up);
                          }}
                          className="w-4 h-4 accent-orange-500 cursor-pointer"
                        />
                        <input 
                          value={opt}
                          onChange={e => {
                            const up = {...editingQuiz};
                            up.quizData[qIndex].options[oIndex] = e.target.value;
                            setEditingQuiz(up);
                          }}
                          placeholder={`Option ${oIndex + 1}`}
                          className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-orange-500"
                        />
                        <button 
                          onClick={() => {
                            const up = {...editingQuiz};
                            up.quizData[qIndex].options.splice(oIndex, 1);
                            if (up.quizData[qIndex].correctAnswer >= up.quizData[qIndex].options.length) {
                              up.quizData[qIndex].correctAnswer = Math.max(0, up.quizData[qIndex].options.length - 1);
                            }
                            setEditingQuiz(up);
                          }}
                          className="text-white/20 hover:text-red-500 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => {
                        const up = {...editingQuiz};
                        up.quizData[qIndex].options.push("");
                        setEditingQuiz(up);
                      }}
                      className="text-xs text-orange-400 hover:text-orange-300 font-bold mt-2 flex items-center gap-1"
                    >
                      <Plus size={14}/> Add Option
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => {
                  const up = {...editingQuiz};
                  up.quizData.push({ question: "", options: ["", ""], correctAnswer: 0 });
                  setEditingQuiz(up);
                }}
                className="w-full py-4 border border-dashed border-white/20 rounded-xl text-white/50 hover:text-white hover:border-white/50 transition font-bold"
              >
                + Add Another Question
              </button>
            </div>
            
            <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-white/10">
              <button onClick={() => setEditingQuiz(null)} className="px-6 py-2 rounded-xl text-white/70 hover:bg-white/5 font-bold transition">Cancel</button>
              <button onClick={saveQuiz} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-orange-500/20 transition">Save Quiz</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
