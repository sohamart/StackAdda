import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Download,
  FileText,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

import API from "../../api/axios";
import { useAuth } from "../../Context/AuthContext";
import VideoFrame from "../../Components/VideoFrame";
import io from "socket.io-client";
import LiveClassCard from "../../Components/LiveClass/LiveClassCard";
import WaitingRoom from "../../Components/LiveClass/WaitingRoom";
import LiveClassPlayer from "../../Components/LiveClass/LiveClassPlayer";
import LiveAlert from "../../Components/LiveClass/LiveAlert";
import {
  getResourceFileName,
  downloadResourceFile,
} from "../../utils/resourceDownloads";

const addLessonMeta = (course) =>
  (course?.chapters || []).map((chapter) => ({
    ...chapter,
    lessons: (chapter.lessons || []).map((lesson) => ({
      ...lesson,
      chapterId: chapter._id,
      chapterTitle: chapter.title,
    })),
  }));

export default function LearnCourse() {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [active, setActive] = useState(null);
  const [open, setOpen] = useState({});

  // Live Class State
  const [activeLiveClasses, setActiveLiveClasses] = useState([]);
  const [currentLiveSession, setCurrentLiveSession] = useState(null); // The specific class object the student is trying to view
  const [liveViewMode, setLiveViewMode] = useState(null); // null | "waiting" | "live"

  // Load course data
  useEffect(() => {
    API.get(`/course/learn/${id}`)
      .then(({ data }) => {
        const chapters = addLessonMeta(data.course);
        const firstLesson = chapters[0]?.lessons?.[0] || null;

        setCourse({
          ...data.course,
          chapters,
        });
        setActive(firstLesson);
        setOpen({
          [chapters[0]?._id]: true,
        });
      })
      .catch((e) =>
        toast.error(e.response?.data?.message || "Could not open course.")
      );
  }, [id]);

  // Load live class data and setup sockets
  useEffect(() => {
    API.get(`/live-class/course/${id}`)
      .then((res) => setActiveLiveClasses(res.data.liveClasses || []))
      .catch(console.error);

    const socket = io(API.defaults.baseURL.replace("/api", ""));
    socket.emit("join_course_room", id);

    socket.on("class_created", (newClass) => {
      setActiveLiveClasses((prev) => [newClass, ...prev]);
    });

    socket.on("class_updated", (updatedClass) => {
      setActiveLiveClasses((prev) => prev.map((c) => (c._id === updatedClass._id ? updatedClass : c)));
      setCurrentLiveSession((prev) => (prev?._id === updatedClass._id ? updatedClass : prev));
    });

    socket.on("class_started", (startedClass) => {
      setActiveLiveClasses((prev) => prev.map((c) => (c._id === startedClass._id ? startedClass : c)));
      setCurrentLiveSession((prev) => {
        if (prev?._id === startedClass._id) {
          setLiveViewMode("live"); // Auto-join from waiting room!
          return startedClass;
        }
        return prev;
      });
    });

    socket.on("class_ended", (endedClass) => {
      setActiveLiveClasses((prev) => prev.map((c) => (c._id === endedClass._id ? endedClass : c)));
      setCurrentLiveSession((prev) => {
        if (prev?._id === endedClass._id) {
          setLiveViewMode(null); // Kick out of player
          toast.info("The live class has ended.");
          return null;
        }
        return prev;
      });
    });

    socket.on("class_cancelled", (classId) => {
      setActiveLiveClasses((prev) => prev.filter((c) => c._id !== classId));
      setCurrentLiveSession((prev) => {
        if (prev?._id === classId) {
          setLiveViewMode(null);
          toast.error("The live class was cancelled.");
          return null;
        }
        return prev;
      });
    });

    socket.on("class_status_changed", (updatedClass) => {
      setActiveLiveClasses((prev) => prev.map((c) => (c._id === updatedClass._id ? updatedClass : c)));
    });

    return () => {
      socket.emit("leave_course_room", id);
      socket.disconnect();
    };
  }, [id]);

  // Handle Join button click on the card
  const handleJoinClass = (liveClass) => {
    setCurrentLiveSession(liveClass);
    if (liveClass.status === "Live") {
      setLiveViewMode("live");
    } else {
      setLiveViewMode("waiting");
    }
  };

  const handleLeaveClass = () => {
    setCurrentLiveSession(null);
    setLiveViewMode(null);
  };

  const resources = useMemo(() => active?.resources || [], [active]);

  if (!course) {
    return (
      <div className="flex h-[65vh] items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={45} />
      </div>
    );
  }

  return (
    <section className="space-y-6 text-white">
      <LiveAlert activeLiveClasses={activeLiveClasses} />
      
      <div className="flex items-center justify-between">
        <Link
          to="/student/courses"
          className="inline-flex items-center gap-2 text-orange-400"
        >
          <ArrowLeft size={18} />
          My courses
        </Link>

        {currentLiveSession && liveViewMode && (
          <button 
            onClick={handleLeaveClass}
            className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/30"
          >
            Leave {liveViewMode === "waiting" ? "Waiting Room" : "Live Class"}
          </button>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.65fr_.8fr]">
        <main className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/4.5 flex flex-col">
          {currentLiveSession && liveViewMode === "waiting" ? (
            <div className="flex-1 p-6">
              <WaitingRoom liveClass={currentLiveSession} />
            </div>
          ) : currentLiveSession && liveViewMode === "live" ? (
            <div className="aspect-video w-full bg-black">
               <LiveClassPlayer liveClass={currentLiveSession} user={user} onLeave={handleLeaveClass} />
            </div>
          ) : (
            <div className="aspect-video bg-black relative">
              <VideoFrame url={active?.video?.url} title={active?.title} />
            </div>
          )}

          {!currentLiveSession && activeLiveClasses.length > 0 && (
            <div className="p-4 sm:p-6 pb-0">
               {activeLiveClasses.filter(c => c.status !== "Completed" && c.status !== "Ended").map(cls => (
                 <LiveClassCard key={cls._id} liveClass={cls} onJoin={handleJoinClass} />
               ))}
            </div>
          )}

          {!currentLiveSession && resources.length > 0 && (
            <div className="mx-3 mt-3 rounded-2xl border border-white/15 bg-black/75 p-3 backdrop-blur-xl sm:mx-4 sm:p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/80">
                <FileText size={16} className="text-orange-400" />
                Lesson resources
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {resources.map((resource) => {
                  const fileName = getResourceFileName(resource);
                  const isLinkResource = resource.type !== "file";

                  return (
                    <a
                      key={resource._id}
                      href={isLinkResource ? resource.url : "#"}
                      target={isLinkResource ? "_blank" : undefined}
                      rel={isLinkResource ? "noreferrer" : undefined}
                      onClick={async (event) => {
                        if (isLinkResource) return;

                        event.preventDefault();
                        try {
                          await downloadResourceFile({
                            courseId: course._id,
                            chapterId: active.chapterId,
                            lessonId: active._id,
                            resourceId: resource._id,
                            fileName,
                          });
                        } catch (error) {
                          toast.error(
                            error.message || "Could not download resource."
                          );
                        }
                      }}
                      className="inline-flex min-w-0 items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm text-white transition hover:bg-orange-500"
                    >
                      {isLinkResource ? (
                        <ExternalLink size={15} className="shrink-0" />
                      ) : (
                        <Download size={15} className="shrink-0" />
                      )}
                      <span className="min-w-0 flex-1 truncate">
                        {resource.title}
                      </span>
                      <span className="hidden shrink-0 text-xs text-white/45 sm:inline">
                        {fileName}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          <div className="p-5 sm:p-6">
            <p className="text-sm text-orange-300">
              {course.title}
            </p>

            <h1 className="mt-2 wrap-break-word text-2xl font-bold">
              {active?.title || "No lesson selected"}
            </h1>

            <p className="mt-3 leading-7 text-white/55">
              {active?.description || "Select a lesson to start learning."}
            </p>
          </div>
        </main>

        <aside className="h-fit rounded-3xl border border-white/10 bg-white/4.5 p-4">
          <h2 className="mb-4 font-semibold">Course content</h2>



          {course.chapters.map((chapter, index) => (
            <div key={chapter._id} className="mb-2 rounded-2xl bg-black/20">
              <button
                onClick={() =>
                  setOpen({
                    ...open,
                    [chapter._id]: !open[chapter._id],
                  })
                }
                className="flex w-full items-center gap-2 p-3 text-left"
              >
                <span className="shrink-0 text-orange-400">
                  {open[chapter._id] ? (
                    <ChevronDown size={17} />
                  ) : (
                    <ChevronRight size={17} />
                  )}
                </span>

                <span className="min-w-0 flex-1 wrap-break-word">
                  {index + 1}. {chapter.title}
                </span>
              </button>

              {open[chapter._id] && (
                <div className="border-t border-white/10 p-2">
                  {chapter.lessons.map((lesson) => (
                    <button
                      key={lesson._id}
                      onClick={() => { setActive(lesson); }}
                      className={`w-full rounded-xl p-2.5 text-left text-sm transition ${active?._id === lesson._id
                          ? "bg-orange-500/15 text-orange-200"
                          : "text-white/65 hover:bg-white/5 hover:text-white"
                        }`}
                    >
                      <span className="block wrap-break-word">{lesson.title}</span>

                      {lesson.resources?.length > 0 && (
                        <span className="mt-1 block text-xs text-orange-300">
                          {lesson.resources.length} resource
                          {lesson.resources.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
