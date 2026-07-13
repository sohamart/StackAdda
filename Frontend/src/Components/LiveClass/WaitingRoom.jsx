import React, { useState, useEffect } from "react";
import { Clock, Shield, Wifi, Monitor, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function WaitingRoom({ liveClass }) {
  const [timeToStart, setTimeToStart] = useState("");

  useEffect(() => {
    // Basic countdown string
    const interval = setInterval(() => {
      try {
        const start = new Date(`${format(new Date(liveClass.date), "yyyy-MM-dd")}T${convertTo24Hour(liveClass.startTime)}`);
        if (start > new Date()) {
          setTimeToStart(`Starts in ${formatDistanceToNow(start)}`);
        } else {
          setTimeToStart("Should be starting momentarily...");
        }
      } catch (e) {
        setTimeToStart("Waiting for host...");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [liveClass]);

  // Helper to convert 12h to 24h for Date parsing
  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return "00:00:00";
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") hours = "00";
    if (modifier === "PM") hours = parseInt(hours, 10) + 12;
    return `${hours}:${minutes}:00`;
  };

  return (
    <div className="flex h-full w-full flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-6">
        <div className="relative aspect-[16/9] w-full lg:min-h-[65vh] overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {liveClass.introVideoUrl ? (
            liveClass.introVideoUrl.includes("youtube.com") || liveClass.introVideoUrl.includes("youtu.be") ? (
              <iframe
                src={`https://www.youtube.com/embed/${liveClass.introVideoUrl.split(/v=|youtu\.be\//)[1].split(/[?&]/)[0]}?autoplay=1&mute=1&loop=1&controls=0&disablekb=1&modestbranding=1&playlist=${liveClass.introVideoUrl.split(/v=|youtu\.be\//)[1].split(/[?&]/)[0]}`}
                className="absolute inset-0 h-full w-full border-0 pointer-events-none scale-150 transform-gpu"
                allow="autoplay; encrypted-media"
                title="Intro Video"
              />
            ) : (
              <video
                src={liveClass.introVideoUrl}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                className="absolute inset-0 h-full w-full object-cover pointer-events-none"
              />
            )
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-900">
              <div className="h-24 w-24 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin mb-6" />
              <p className="text-xl font-medium text-white/50">Waiting for Instructor</p>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-black/40 to-transparent flex flex-col justify-end p-8 md:p-12 pointer-events-none">
            <span className="mb-4 inline-flex w-fit items-center rounded-full bg-orange-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-400 border border-orange-500/20 backdrop-blur-md">
              <span className="mr-2 h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" /> Live Event
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-2xl tracking-tight">{liveClass.title}</h1>
            <p className="text-lg md:text-xl text-white/80 font-medium drop-shadow-md">with {liveClass.facultyName}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[.045] p-6 md:p-8 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400">
              <Clock size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-white/50 uppercase tracking-wider mb-1">Status</p>
              <p className="text-xl font-bold text-white">{timeToStart || "Waiting for host..."}</p>
            </div>
          </div>
          <p className="text-white/60 max-w-sm text-right">
            The class will start automatically once the instructor begins the broadcast. You do not need to refresh this page.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <div className="rounded-3xl border border-white/10 bg-white/[.045] p-6 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="text-orange-400" size={20} /> Class Rules
          </h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              Keep your microphone muted when not speaking.
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              Use the "Raise Hand" feature to ask questions.
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              Be respectful in the chat window.
            </li>
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[.045] p-6 backdrop-blur-xl">
          <h3 className="text-lg font-bold text-white mb-4">System Check</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm font-medium text-white/80">
                <Wifi size={18} className="text-green-400" /> Connection
              </div>
              <CheckCircle2 size={18} className="text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm font-medium text-white/80">
                <Monitor size={18} className="text-green-400" /> Browser
              </div>
              <CheckCircle2 size={18} className="text-green-500" />
            </div>
            <p className="text-xs text-white/40 mt-2 text-center">Everything looks good! Ready to join.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
