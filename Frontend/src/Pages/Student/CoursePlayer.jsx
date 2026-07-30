import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { Loader2, Menu, X, PlayCircle, BookOpen, CheckCircle, ChevronRight, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function CoursePlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Close sidebar by default on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchEnrolledCourse();
  }, [id]);

  const fetchEnrolledCourse = async () => {
    try {
      const { data } = await API.get(`/course/learn/${id}`);
      if (data.success) {
        setCourse(data.course);
        // Set first lesson as active
        if (data.course.chapters?.[0]?.lessons?.[0]) {
          setActiveLesson(data.course.chapters[0].lessons[0]);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load course");
      navigate("/student"); // Redirect to dashboard
    } finally {
      setLoading(false);
    }
  };

  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleQuizSubmit = () => {
    if (!activeLesson?.quizData) return;
    let currentScore = 0;
    activeLesson.quizData.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        currentScore += 1;
      }
    });
    setScore(currentScore);
    setQuizSubmitted(true);
  };

  const handleLessonChange = (lesson) => {
    setActiveLesson(lesson);
    // Reset Quiz State
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    // Auto close sidebar on mobile
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09090B]">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  if (!course) {
    return <div className="h-screen flex items-center justify-center bg-[#09090B] text-white">Course Not Found</div>;
  }

  return (
    <div className="flex h-screen bg-[#09090B] text-white overflow-hidden relative">
      
      {/* Mobile Topbar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#09090B] absolute top-0 left-0 w-full z-30">
        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-lg text-white hover:bg-white/10">
          <Menu size={24} />
        </button>
        <h1 className="font-bold text-sm truncate flex-1 px-4 text-center">{course.title}</h1>
        <div className="w-10"></div>
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-[80%] sm:w-80 bg-[#09090B] border-r border-white/10 transition-transform duration-300 flex flex-col h-full`}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-bold text-lg line-clamp-2">{course.title}</h2>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/50 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar" data-lenis-prevent="true">
          {course.chapters?.map((chapter, cIdx) => (
            <div key={chapter._id || cIdx} className="border-b border-white/5">
              <div className="px-4 py-3 bg-white/[0.02] text-sm font-bold text-white/80">
                {chapter.title}
              </div>
              <div className="flex flex-col">
                {chapter.lessons?.map((lesson, lIdx) => {
                  const isActive = activeLesson?._id === lesson._id;
                  return (
                    <button
                      key={lesson._id || lIdx}
                      onClick={() => handleLessonChange(lesson)}
                      className={`text-left px-4 py-3 flex gap-3 transition-colors ${isActive ? "bg-orange-500/10 border-l-2 border-orange-500" : "hover:bg-white/[0.02] border-l-2 border-transparent"}`}
                    >
                      <div className="mt-0.5 text-white/40">
                        {lesson.type === 'quiz' ? <BookOpen size={16} className={isActive ? "text-orange-400" : ""} /> : <PlayCircle size={16} className={isActive ? "text-orange-400" : ""} />}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold line-clamp-2 ${isActive ? "text-orange-400" : "text-white/70"}`}>
                          {lesson.title}
                        </p>
                        <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold mt-1 block">
                          {lesson.type} {lesson.duration ? `• ${lesson.duration}` : ''}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-y-auto pt-[73px] lg:pt-0" data-lenis-prevent="true">
        {activeLesson ? (
          <div className="max-w-5xl mx-auto w-full p-4 lg:p-8 space-y-6 lg:space-y-8">
            
            {/* Header */}
            <div className="flex items-center gap-2 text-orange-400 text-sm font-bold uppercase tracking-wider">
              <span>{activeLesson.type}</span>
              <ChevronRight size={14} />
              <span className="text-white">{activeLesson.title}</span>
            </div>

            {/* Video Player */}
            {activeLesson.type === 'video' && activeLesson.video?.url && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/10">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${getYoutubeVideoId(activeLesson.video.url)}?autoplay=0&rel=0`}
                  title={activeLesson.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {/* Quiz Player */}
            {activeLesson.type === 'quiz' && (
              <div className="bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-5 lg:p-10">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <BookOpen className="text-orange-500" />
                  Knowledge Check
                </h2>
                
                {quizSubmitted ? (
                  <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 text-green-500 mb-6">
                      <span className="text-4xl font-black">{score}/{activeLesson.quizData?.length}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
                    <p className="text-white/60 mb-8">You have successfully submitted your answers.</p>
                    <button 
                      onClick={() => { setQuizSubmitted(false); setSelectedAnswers({}); }}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                      Retake Quiz
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {activeLesson.quizData?.map((q, idx) => (
                      <div key={idx} className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">
                          <span className="text-orange-500 mr-2">{idx + 1}.</span>
                          {q.question}
                        </h4>
                        <div className="grid gap-3">
                          {q.options?.map((opt, optIdx) => (
                            <label 
                              key={optIdx} 
                              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${selectedAnswers[idx] === optIdx ? "bg-orange-500/10 border-orange-500 text-orange-400" : "bg-black/30 border-white/10 text-white hover:bg-white/5"}`}
                            >
                              <input 
                                type="radio" 
                                name={`question-${idx}`} 
                                className="hidden"
                                checked={selectedAnswers[idx] === optIdx}
                                onChange={() => setSelectedAnswers({ ...selectedAnswers, [idx]: optIdx })}
                              />
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAnswers[idx] === optIdx ? "border-orange-500" : "border-white/30"}`}>
                                {selectedAnswers[idx] === optIdx && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                              </div>
                              <span className="font-medium">{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(selectedAnswers).length < (activeLesson.quizData?.length || 0)}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition mt-8"
                    >
                      Submit Answers
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-white/5 border border-white/10 rounded-2xl lg:rounded-3xl p-5 lg:p-8">
              <h3 className="text-xl font-bold mb-4">About this {activeLesson.type}</h3>
              <div className="text-white/60 leading-relaxed whitespace-pre-line select-text">
                {activeLesson.description ? (
                  activeLesson.description.split(/(https?:\/\/[^\s]+)/g).map((part, i) => 
                    /(https?:\/\/[^\s]+)/.test(part) ? (
                      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline hover:text-orange-300 transition-colors">
                        {part}
                      </a>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )
                ) : (
                  "No description provided."
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-white/50">
            <PlayCircle size={64} className="mb-4 opacity-20" />
            <p>Select a lesson from the sidebar to start learning.</p>
          </div>
        )}
      </div>

    </div>
  );
}
