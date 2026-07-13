import React from "react";
import { Video, Clock, Calendar, Users, ExternalLink, Play } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function LiveClassCard({ liveClass, onJoin }) {
  if (!liveClass) return null;

  const isLive = liveClass.status === "Live" || liveClass.status === "Starting";
  const isUpcoming = liveClass.status === "Upcoming";
  const isWaiting = liveClass.status === "Waiting for Host";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl border ${
        isLive ? "border-orange-500/50 bg-orange-500/5" : "border-white/10 bg-white/[.045]"
      } p-6 backdrop-blur-2xl shadow-xl`}
    >
      {/* Background glowing effect if live */}
      {isLive && (
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-orange-500/20 blur-[80px] pointer-events-none" />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
              isLive ? "bg-red-500/10 text-red-500 border border-red-500/20" :
              isWaiting ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" :
              "bg-blue-500/10 text-blue-400 border border-blue-500/20"
            }`}>
              {isLive && <span className="mr-2 h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}
              {liveClass.status}
            </span>
            <span className="text-sm font-medium text-white/50 flex items-center gap-1.5">
              <Calendar size={14} /> {format(new Date(liveClass.date), "MMM d, yyyy")}
            </span>
            <span className="text-sm font-medium text-white/50 flex items-center gap-1.5">
              <Clock size={14} /> {liveClass.startTime}
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">{liveClass.title}</h3>
          
          <div className="flex items-center gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Users size={16} className="text-orange-400" />
              By {liveClass.facultyName}
            </span>
            {liveClass.subject && (
              <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                {liveClass.subject}
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          {isUpcoming && (
            <div className="text-center bg-white/5 rounded-2xl px-5 py-3 border border-white/10">
              <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">Starts at</p>
              <p className="text-lg font-bold text-white">{liveClass.startTime}</p>
            </div>
          )}
          
          {(isWaiting || isLive || isUpcoming) && (
            <button
              onClick={() => onJoin(liveClass)}
              className={`flex items-center gap-2 rounded-2xl px-6 py-4 font-bold transition-all ${
                isLive
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-105"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
              }`}
            >
              {isLive ? <Play className="fill-current" size={20} /> : <ExternalLink size={20} />}
              {isLive ? "Join Live Class Now" : "Enter Waiting Room"}
            </button>
          )}
          
          {(liveClass.status === "Ended" || liveClass.status === "Completed") && (
            <div className="text-center bg-white/5 rounded-2xl px-6 py-4 border border-white/10 text-white/50 font-medium">
              Class Ended
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
