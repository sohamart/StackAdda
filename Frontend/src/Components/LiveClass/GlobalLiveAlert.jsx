import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import { useAuth } from "../../Context/AuthContext";
import API from "../../api/axios";

export default function GlobalLiveAlert() {
  const [alerts, setAlerts] = useState([]);
  const [courseIds, setCourseIds] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setAlerts([]);
      return;
    }

    // Fetch initially
    API.get("/live-class/my-active")
      .then((res) => {
        if (res.data.success) {
          setAlerts(res.data.liveClasses);
          setCourseIds(res.data.courseIds || []);
        }
      })
      .catch((err) => console.error("Could not fetch active live classes", err));
  }, [user]);

  useEffect(() => {
    if (!user || courseIds.length === 0) return;

    const socket = io(API.defaults.baseURL.replace("/api", ""));
    
    // Join rooms for all enrolled courses to listen for class starts
    courseIds.forEach(id => socket.emit("join_course_room", id));

    socket.on("class_started", (startedClass) => {
      setAlerts((prev) => {
        // Prevent duplicate alerts
        if (prev.find(c => c._id === startedClass._id)) return prev;
        return [...prev, startedClass];
      });
    });

    socket.on("class_ended", (endedClass) => {
      setAlerts((prev) => prev.filter(c => c._id !== endedClass._id));
    });

    socket.on("class_cancelled", (classId) => {
      setAlerts((prev) => prev.filter(c => c._id !== classId));
    });

    socket.on("class_status_changed", (updatedClass) => {
      setAlerts((prev) => {
        if (updatedClass.status === "Ended" || updatedClass.status === "Completed" || updatedClass.status === "Cancelled") {
           return prev.filter(c => c._id !== updatedClass._id);
        }
        return prev;
      });
    });

    return () => {
      courseIds.forEach(id => socket.emit("leave_course_room", id));
      socket.disconnect();
    };
  }, [user, courseIds]);

  const dismiss = (id) => {
    setAlerts(alerts.filter(a => a._id !== id));
  };

  // Do not show alert if user is already on the attend page for that class
  const filteredAlerts = alerts.filter(cls => !location.pathname.includes(`/live-class/${cls._id}`));

  if (filteredAlerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-4">
      <AnimatePresence>
        {filteredAlerts.map((cls) => (
          <motion.div
            key={cls._id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
            className="w-80 md:w-96 rounded-2xl border border-orange-500/30 bg-black/90 backdrop-blur-3xl shadow-[0_20px_50px_rgba(249,115,22,0.25)] overflow-hidden"
          >
            <div className="flex items-center justify-between bg-orange-500/10 px-4 py-3 border-b border-orange-500/20">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-orange-400">
                  {user.role === 'admin' ? "Class is Live Now (Admin)" : "Class is Live Now"}
                </span>
              </div>
              <button onClick={() => dismiss(cls._id)} className="text-white/50 hover:text-white">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5">
              <h4 className="text-lg font-bold text-white mb-1 line-clamp-1">{cls.title}</h4>
              <p className="text-sm text-white/60 mb-5 line-clamp-1">with {cls.facultyName}</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => dismiss(cls._id)}
                  className="flex-1 rounded-xl bg-white/10 py-2.5 text-sm font-medium text-white hover:bg-white/20 transition-colors"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => {
                    if (user.role === 'admin') {
                       navigate(`/admin/course/${cls.course}`); // Admin goes to manager
                    } else {
                       navigate(`/live-class/${cls._id}`); // Student goes to attend page
                    }
                    dismiss(cls._id);
                  }}
                  className="flex-1 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-orange-500/25 transition-all hover:scale-105"
                >
                  {user.role === 'admin' ? "Manage" : "Join Now"} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
