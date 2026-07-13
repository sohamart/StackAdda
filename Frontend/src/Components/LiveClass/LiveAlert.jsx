import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, X, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LiveAlert({ activeLiveClasses }) {
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Filter classes that are currently Live
    const liveNow = activeLiveClasses.filter(cls => cls.status === "Live" || cls.status === "Starting");
    setAlerts(liveNow);
  }, [activeLiveClasses]);

  const dismiss = (id) => {
    setAlerts(alerts.filter(a => a._id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4">
      <AnimatePresence>
        {alerts.map((cls) => (
          <motion.div
            key={cls._id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
            className="w-80 md:w-96 rounded-2xl border border-orange-500/30 bg-black/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(249,115,22,0.15)] overflow-hidden"
          >
            <div className="flex items-center justify-between bg-orange-500/10 px-4 py-3 border-b border-orange-500/20">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-orange-400">Class is Live Now</span>
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
                  Remind Me
                </button>
                <button 
                  onClick={() => {
                    navigate(`/student/course/${cls.course}?liveClass=${cls._id}`);
                    dismiss(cls._id);
                  }}
                  className="flex-1 flex justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-orange-500/25 transition-all hover:scale-105"
                >
                  Join Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
