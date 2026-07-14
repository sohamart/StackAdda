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

  const [isConnected, setIsConnected] = useState(navigator.onLine);

  const [viewerCount, setViewerCount] = useState(1);

  useEffect(() => {
    document.title = liveClass
      ? `${liveClass.title} • Live Class`
      : "Live Classroom";
  }, [liveClass]);

  const isLive = useMemo(() => {
    return liveClass?.status === "Live";
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

  // ===============================
  // Fetch Live Class + Course
  // ===============================
  useEffect(() => {
    let mounted = true;

    const fetchLiveClass = async () => {
      try {
        setLoading(true);

        const { data } = await API.get(`/live-class/${id}`);

        if (!mounted) return;

        const cls = data.liveClass;
        setLiveClass(cls);

        const courseRes = await API.get(`/course/learn/${cls.course}`);

        if (!mounted) return;

        setCourse(courseRes.data.course);

        if (cls.status === "Live") {
          setLiveViewMode("live");
        } else {
          setLiveViewMode("waiting");
        }
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Could not access this live class."
        );

        navigate("/courses");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLiveClass();

    return () => {
      mounted = false;
    };
  }, [id, navigate]);

  // ===============================
  // Share Live Class
  // ===============================
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator
            // ===============================
    // Live Events
    // ===============================

    socket.on("class_started", (startedClass) => {
      if (startedClass._id !== liveClass._id) return;

      setLiveClass(startedClass);
      setLiveViewMode("live");

      toast.success("🔴 Live class has started!");
    });

    socket.on("class_ended", (endedClass) => {
      if (endedClass._id !== liveClass._id) return;

      setLiveClass(endedClass);
      setLiveViewMode("ended");

      toast.info("The live class has ended.");
    });

    socket.on("class_cancelled", (classId) => {
      if (classId !== liveClass._id) return;

      setLiveViewMode("cancelled");

      toast.error("This live class has been cancelled.");
    });

    socket.on("class_updated", (updatedClass) => {
      if (updatedClass._id !== liveClass._id) return;

      setLiveClass(updatedClass);
    });

    socket.on("class_status_changed", (updatedClass) => {
      if (updatedClass._id !== liveClass._id) return;

      setLiveClass(updatedClass);

      switch (updatedClass.status) {
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

    return () => {
      socket.emit("leave_course_room", course._id);

      socket.removeAllListeners();

      socket.disconnect();
    };
  }, [course, liveClass]);

  // ===============================
  // Loading Screen
  // ===============================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">

          <Loader2
            className="animate-spin text-orange-500"
            size={55}
          />

          <h2 className="text-xl font-bold text-white">
            Preparing Live Classroom
          </h2>

          <p className="text-sm text-white/50">
            Connecting to live session...
          </p>

        </div>
      </div>
    );
  }

  if (!liveClass || !course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Live class not found.
      </div>
    );
  }

  return (
  <section className="relative min-h-screen overflow-hidden bg-[#09090B] text-white">

    {/* Background Glow */}
    <div className="absolute left-1/2 top-0 h-[350px] w-[900px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[150px]" />

    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">

      {/* ================= HEADER ================= */}

      <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">

        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">

          {/* Left */}

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

              <p className="mt-1 text-sm text-white/55">
                {course.title}
              </p>

            </div>

          </div>

          {/* Right */}

          <div className="flex flex-wrap items-center gap-3">

            {/* Live Badge */}

            {isLive ? (
              <div className="flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-2">

                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />

                <span className="font-semibold text-red-400">
                  LIVE
                </span>

              </div>
            ) : (
              <div className="rounded-full bg-yellow-500/20 px-4 py-2 text-sm font-medium text-yellow-300">
                Waiting
              </div>
            )}

            {/* Viewer */}

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">

              <Users size={16} className="text-orange-400" />

              <span>{viewerCount}</span>

            </div>

            {/* Network */}

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">

              {isConnected ? (
                <>
                  <Wifi size={16} className="text-green-400" />
                  <span className="text-green-400">
                    Connected
                  </span>
                </>
              ) : (
                <>
                  <WifiOff size={16} className="text-red-400" />
                  <span className="text-red-400">
                    Offline
                  </span>
                </>
              )}

            </div>

            {/* Share */}

            <button
              onClick={handleShare}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:border-orange-500 hover:bg-orange-500/10"
            >
              <Share2 size={18} />
            </button>

          </div>

        </div>

      </div>
      {/* ================= MAIN CONTENT ================= */}

{/* ================= MAIN CONTENT ================= */}

<div className="flex-1 flex">

  <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl overflow-hidden shadow-[0_0_80px_rgba(249,115,22,0.08)]">

    {/* Live Status Bar */}

    <div className="border-b border-white/10 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10 px-5 py-4">

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

        <div>

          <h2 className="text-lg font-bold">

            {liveClass.title}

          </h2>

          <p className="mt-1 text-sm text-white/50">

            {course.title}

          </p>

        </div>

        <div className="flex flex-wrap items-center gap-3">

          <div className="rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2">

            <span className="text-sm text-orange-300">

              {isLive
                ? "Live Session"
                : liveViewMode === "waiting"
                ? "Waiting Room"
                : "Session Finished"}

            </span>

          </div>

          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2">

            <span className="text-sm text-white/60">

              Instructor

            </span>

            <span className="ml-2 font-medium">

              {liveClass.teacher?.name || "Stack Adda"}

            </span>

          </div>

        </div>

      </div>

    </div>

    {/* Player Area */}

    <div className="relative bg-black">
      {/* ================= PLAYER ================= */}

{liveViewMode === "waiting" ? (

  <div className="flex min-h-[70vh] items-center justify-center p-4 sm:p-6 lg:p-10">

    <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl">

      <WaitingRoom
        liveClass={liveClass}
      />

    </div>

  </div>

) : liveViewMode === "live" ? (

  <div className="flex min-h-[70vh] flex-col">

    {/* Live Banner */}

    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-red-500/10 px-5 py-3">

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

    {/* Player */}

    <div className="flex-1 bg-black">

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

        <Radio className="text-red-400" size={34} />

      </div>

      <h2 className="text-3xl font-bold">
        Live Session Ended
      </h2>

      <p className="mt-4 leading-7 text-white/60">
        This live class has ended. You can return to your
        course dashboard to continue learning or join the
        next scheduled live session.
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

</div>

</section>
);
