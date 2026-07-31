import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import API from "../../api/axios";

export default function ProtectedVideoWrapper({ children }) {
  const { user } = useAuth();
  const [isBlurred, setIsBlurred] = useState(false);
  const [isPermanentlyBlocked, setIsPermanentlyBlocked] = useState(false);
  const hasReported = useRef(false);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    // Generate 3 watermarks if not admin
    if (!user || user.role === "admin") return;

    const marks = Array.from({ length: 1 }).map((_, i) => ({
      id: i,
      x: Math.random() * 70, // 0 to 70% width
      y: Math.random() * 80, // 0 to 80% height
    }));
    setPositions(marks);

    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((mark) => ({
          ...mark,
          x: Math.random() * 70,
          y: Math.random() * 80,
        }))
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user || user.role === "admin") return;

    const handleBlur = () => {
      // Small timeout to allow focus to settle
      setTimeout(() => {
        if (!document.hasFocus()) {
          setIsBlurred(true);
        }
      }, 100);
    };
    
    const handleFocus = () => {
      setIsBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) setIsBlurred(true);
      else setIsBlurred(false);
    };

    // Block PrintScreen specifically - THIS triggers permanent block
    const handleKeyDown = (e) => {
      if (e.key === "PrintScreen" || (e.metaKey && e.shiftKey && (e.key === "S" || e.key === "s"))) {
         navigator.clipboard.writeText(""); 
         setIsPermanentlyBlocked(true);

         if (!hasReported.current) {
           hasReported.current = true;
           toast.error("Screen recording detected! A warning has been sent to your email.");
           API.post('/student/report-piracy').catch(console.error);
         }
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [user]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none" onContextMenu={e => user?.role !== 'admin' && e.preventDefault()}>
      
      {/* The Actual Video */}
      <div className={`w-full h-full transition-opacity duration-75 ${(isBlurred || isPermanentlyBlocked) ? "opacity-0" : "opacity-100"}`}>
        {children}
      </div>

      {/* Blackout Overlay */}
      {(isBlurred || isPermanentlyBlocked) && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center text-center p-4">
          <span className="text-white/50 text-sm font-medium tracking-widest uppercase">Screen recording / Snipping tool detected</span>
          
          {isPermanentlyBlocked ? (
             <span className="text-red-500/80 text-xs mt-3 font-bold">Please REFRESH the page to continue watching.</span>
          ) : (
             <span className="text-white/30 text-xs mt-2">Please click back into the window to resume.</span>
          )}
        </div>
      )}

      {/* Watermarks inside the container */}
      {!(isBlurred || isPermanentlyBlocked) && user && user.role !== "admin" && positions.map((mark) => (
        <motion.div
          key={mark.id}
          animate={{ left: `${mark.x}%`, top: `${mark.y}%` }}
          transition={{ type: "tween", duration: 3.5, ease: "linear" }}
          className="absolute whitespace-nowrap text-[10px] sm:text-xs font-bold text-white/40 mix-blend-difference tracking-widest uppercase pointer-events-none z-40"
        >
          {user.email} <br />
          ID: {user._id}
        </motion.div>
      ))}
    </div>
  );
}
