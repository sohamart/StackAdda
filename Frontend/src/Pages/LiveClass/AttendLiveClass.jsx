import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import io from "socket.io-client";

import API from "../../api/axios";
import { useAuth } from "../../Context/AuthContext";
import WaitingRoom from "../../Components/LiveClass/WaitingRoom";
import LiveClassPlayer from "../../Components/LiveClass/LiveClassPlayer";

export default function AttendLiveClass() {
  const { id } = useParams(); // This is live class ID
  const { user } = useAuth();
  const navigate = useNavigate();

  const [liveClass, setLiveClass] = useState(null);
  const [course, setCourse] = useState(null);
  const [liveViewMode, setLiveViewMode] = useState("waiting"); // "waiting" | "live"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch live class
    API.get(`/live-class/${id}`)
      .then(({ data }) => {
        const cls = data.liveClass;
        setLiveClass(cls);
        
        // 2. Fetch course to verify enrollment
        return API.get(`/course/learn/${cls.course}`);
      })
      .then(({ data }) => {
        setCourse(data.course);
        setLoading(false);
      })
      .catch((e) => {
        toast.error(e.response?.data?.message || "Could not access live class. Please ensure you are enrolled.");
        navigate("/courses"); // Redirect to public courses page if not enrolled
      });
  }, [id, navigate]);

  useEffect(() => {
    if (!liveClass || !course) return;

    if (liveClass.status === "Live") {
      setLiveViewMode("live");
    } else {
      setLiveViewMode("waiting");
    }

    const socket = io(API.defaults.baseURL.replace("/api", ""), {
      transports: ["polling"],
    });
    socket.emit("join_course_room", course._id);

    socket.on("class_started", (startedClass) => {
      if (startedClass._id === liveClass._id) {
        setLiveClass(startedClass);
        setLiveViewMode("live");
      }
    });

    socket.on("class_ended", (endedClass) => {
      if (endedClass._id === liveClass._id) {
        setLiveClass(endedClass);
        setLiveViewMode(null);
        toast.info("The live class has ended.");
      }
    });

    socket.on("class_cancelled", (classId) => {
      if (classId === liveClass._id) {
        setLiveViewMode(null);
        toast.error("The live class was cancelled.");
      }
    });

    socket.on("class_updated", (updatedClass) => {
      if (updatedClass._id === liveClass._id) {
        setLiveClass(updatedClass);
      }
    });
    
    socket.on("class_status_changed", (updatedClass) => {
      if (updatedClass._id === liveClass._id) {
        setLiveClass(updatedClass);
        if(updatedClass.status === "Live") setLiveViewMode("live");
        else if (updatedClass.status === "Ended" || updatedClass.status === "Completed") {
            setLiveViewMode(null);
        } else {
            setLiveViewMode("waiting");
        }
      }
    });

    return () => {
      socket.emit("leave_course_room", course._id);
      socket.disconnect();
    };
  }, [liveClass?._id, course?._id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <Loader2 className="animate-spin text-orange-500" size={45} />
      </div>
    );
  }

  if (!liveClass) {
     return <div className="p-10 text-white flex justify-center w-full">Live class not found.</div>;
  }

  return (
    <section className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden">
      
      {/* Decorative gradient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-orange-500/20 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="container mx-auto px-4 py-6 relative z-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <Link
            to={`/student/course/${course._id}`}
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition"
          >
            <ArrowLeft size={18} />
            Back to Course
          </Link>
          
          <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm font-medium">
            <span className="text-white/60">Class:</span> <span className="text-white">{liveClass.title}</span>
          </div>
        </div>

        <div className="flex-1 max-w-6xl w-full mx-auto bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
           {liveViewMode === "waiting" ? (
             <div className="flex-1 p-4 sm:p-8 md:p-12 flex flex-col justify-center bg-black/40 backdrop-blur-md">
               <WaitingRoom liveClass={liveClass} />
             </div>
           ) : liveViewMode === "live" ? (
             <div className="flex-1 bg-black w-full relative flex flex-col">
                <LiveClassPlayer liveClass={liveClass} user={user} onLeave={() => navigate(`/student/course/${course._id}`)} />
             </div>
           ) : (
             <div className="flex-1 p-12 flex flex-col items-center justify-center text-center bg-black/40 backdrop-blur-md">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                   <div className="w-3 h-3 bg-red-500 rounded-full" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">Live Session Ended</h2>
                <p className="text-white/60 max-w-md">
                   This live class has concluded. You can return to your course dashboard to view other materials or upcoming sessions.
                </p>
                <Link
                   to={`/student/course/${course._id}`}
                   className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-medium transition"
                >
                   Return to Course
                </Link>
             </div>
           )}
        </div>
      </div>
    </section>
  );
}
