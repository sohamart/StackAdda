import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Radio,
  Users,
  Wifi,
  WifiOff,
  Share2,
} from "lucide-react";
import { toast } from "react-toastify";
import io from "socket.io-client";

import API from "../../api/axios";
import { useAuth } from "../../Context/AuthContext";

import WaitingRoom from "../../Components/LiveClass/WaitingRoom";
import LiveClassPlayer from "../../Components/LiveClass/LiveClassPlayer";

export default function AttendLiveClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const socketRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const [course, setCourse] = useState(null);
  const [liveClass, setLiveClass] = useState(null);

  const [liveViewMode, setLiveViewMode] = useState("waiting");

  const [viewerCount, setViewerCount] = useState(1);

  const [isConnected, setIsConnected] = useState(navigator.onLine);

  const isLive = useMemo(
    () => liveClass?.status === "Live",
    [liveClass]
  );

  useEffect(() => {
    document.title = liveClass
      ? `${liveClass.title} • Stack Adda Live`
      : "Stack Adda Live";
  }, [liveClass]);

  useEffect(() => {
    const online = () => setIsConnected(true);

    const offline = () => {
      setIsConnected(false);
      toast.error("Internet connection lost.");
    };

    window.addEventListener("online", online);
    window.addEventListener("offline", offline);

    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadClass() {
      try {
        setLoading(true);

        const { data } = await API.get(`/live-class/${id}`);

        if (!mounted) return;

        setLiveClass(data.liveClass);

        const res = await API.get(
          `/course/learn/${data.liveClass.course}`
        );

        if (!mounted) return;

        setCourse(res.data.course);

        setLiveViewMode(
          data.liveClass.status === "Live"
            ? "live"
            : "waiting"
        );
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Unable to open live class."
        );

        navigate("/courses");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadClass();

    return () => {
      mounted = false;
    };
  }, [id, navigate]);

  // ==========================================
  // Share Live Class
  // ==========================================
  const handleShare = async () => {
    try {
      const shareData = {
        title: liveClass?.title || "Stack Adda Live",
        text: "Join this live class on Stack Adda",
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Live class link copied.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================================
  // Socket Connection
  // ==========================================
  useEffect(() => {
    if (!course || !liveClass) return;

    const socket = io(API.defaults.baseURL.replace("/api", ""), {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.emit("join_course_room", course._id);

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("viewer_count", (count) => {
      setViewerCount(count);
    });

    socket.on("class_started", (cls) => {
      if (cls._id !== liveClass._id) return;

      setLiveClass(cls);
      setLiveViewMode("live");

      toast.success("🔴 Live class started");
    });

    socket.on("class_updated", (cls) => {
      if (cls._id !== liveClass._id) return;

      setLiveClass(cls);
    });

    socket.on("class_status_changed", (cls) => {
      if (cls._id !== liveClass._id) return;

      setLiveClass(cls);

      switch (cls.status) {
        case "Live":
          setLiveViewMode("live");
          break;

        case "Ended":
        case "Completed":
          setLiveViewMode("ended");
          break;

        case "Cancelled":
          setLiveViewMode("cancelled");
          break;

        default:
          setLiveViewMode("waiting");
      }
    });

    socket.on("class_cancelled", () => {
      setLiveViewMode("cancelled");
      toast.error("Live class cancelled.");
    });

    socket.on("class_ended", () => {
      setLiveViewMode("ended");
      toast.info("Live class ended.");
    });

    return () => {
      socket.emit("leave_course_room", course._id);
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [course, liveClass]);

  // ==========================================
  // Loading Screen
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B]">
        <div className="flex flex-col items-center gap-5">
          <Loader2
            size={55}
            className="animate-spin text-orange-500"
          />

          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">
              Preparing Live Classroom
            </h2>

            <p className="mt-2 text-white/60">
              Connecting to live session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!liveClass || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Live class not found.
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#09090B] text-white">

      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-[400px] w-[900px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[160px]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/[0.05] backdrop-blur-xl">

          <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

              <Link
                to={`/student/course/${course._id}`}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-orange-500 hover:bg-orange-500/10"
              >
                <ArrowLeft size={20} />
              </Link>

              <div className="min-w-0">

                <h1 className="truncate text-xl font-bold md:text-2xl">
                  {liveClass.title}
                </h1>

                <p className="mt-1 text-sm text-white/50">
                  {course.title}
                </p>

              </div>

            </div>

            <div className="flex flex-wrap items-center gap-3">

              {isLive ? (
                <div className="flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2">

                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />

                  <span className="font-semibold text-red-400">
                    LIVE
                  </span>

                </div>
              ) : (
                <div className="rounded-full bg-yellow-500/20 px-4 py-2 text-yellow-300">
                  Waiting
                </div>
              )}

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">

                <Users size={16} className="text-orange-400" />

                <span>{viewerCount}</span>

              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">

                {isConnected ? (
                  <>
                    <Wifi
                      size={16}
                      className="text-green-400"
                    />
                    <span className="text-green-400">
                      Online
                    </span>
                  </>
                ) : (
                  <>
                    <WifiOff
                      size={16}
                      className="text-red-400"
                    />
                    <span className="text-red-400">
                      Offline
                    </span>
                  </>
                )}

              </div>

              <button
                onClick={handleShare}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-orange-500 hover:bg-orange-500/10"
              >
                <Share2 size={18} />
              </button>

            </div>

          </div>

        </div>

        {/* ================= PLAYER ================= */}

        <div className="flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_0_80px_rgba(249,115,22,.08)]">

          <div className="border-b border-white/10 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10 px-5 py-4">

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

              <div>

                <h2 className="text-lg font-bold">
                  {liveClass.title}
                </h2>

                <p className="mt-1 text-sm text-white/50">
                  Instructor • {liveClass.teacher?.name || "Stack Adda"}
                </p>

              </div>

              <div className="rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2 text-sm text-orange-300">

                {liveViewMode === "live"
                  ? "Live Session"
                  : liveViewMode === "waiting"
                  ? "Waiting Room"
                  : "Session Finished"}

              </div>

            </div>

          </div>

          <div className="bg-black">

                        {liveViewMode === "waiting" ? (

              <div className="flex min-h-[70vh] items-center justify-center p-4 md:p-8">

                <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl">

                  <WaitingRoom
                    liveClass={liveClass}
                  />

                </div>

              </div>

            ) : liveViewMode === "live" ? (

              <div className="flex min-h-[70vh] flex-col">

                <div className="flex items-center justify-between border-b border-white/10 bg-red-500/10 px-5 py-3">

                  <div className="flex items-center gap-3">

                    <span className="h-3 w-3 animate-pulse rounded-full bg-red-500" />

                    <span className="font-semibold text-red-400">
                      LIVE NOW
                    </span>

                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/60">

                    <Users size={16} />

                    <span>{viewerCount} watching</span>

                  </div>

                </div>

                <div className="flex-1">

                  <LiveClassPlayer
                    liveClass={liveClass}
                    user={user}
                    onLeave={() =>
                      navigate(`/student/course/${course._id}`)
                    }
                  />

                </div>

              </div>

            ) : (

              <div className="flex min-h-[70vh] items-center justify-center p-6">

                <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl">

                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">

                    <Radio
                      className="text-red-400"
                      size={34}
                    />

                  </div>

                  <h2 className="text-3xl font-bold">
                    Live Session Ended
                  </h2>

                  <p className="mt-4 leading-7 text-white/60">
                    This live session has ended.
                    Return to your course dashboard
                    to continue learning.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                    <Link
                      to={`/student/course/${course._id}`}
                      className="flex-1 rounded-xl bg-orange-500 px-6 py-3 text-center font-semibold transition hover:bg-orange-600"
                    >
                      Return to Course
                    </Link>

                    <button
                      onClick={() => window.location.reload()}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:border-orange-500 hover:bg-orange-500/10"
                    >
                      Refresh
                    </button>

                  </div>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </section>

  );
}
