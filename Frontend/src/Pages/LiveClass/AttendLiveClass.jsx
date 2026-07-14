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
