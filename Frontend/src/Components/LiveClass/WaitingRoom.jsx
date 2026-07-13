import React, { useState, useEffect } from "react";
import { Clock, Shield, Wifi, Monitor, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import ReactPlayer from "react-player";

const normalizeStreamUrl = (url) => {
  if (!url) return url;
  
  let cleanUrl = url.trim();
  
  try {
    const isYouTube = cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be");
    if (isYouTube) {
      let id = "";
      if (cleanUrl.includes("youtu.be/")) {
        id = cleanUrl.split("youtu.be/")[1]?.split(/[?&]/)[0];
      } else if (cleanUrl.includes("/live/")) {
        id = cleanUrl.split("/live/")[1]?.split(/[?&]/)[0];
      } else if (cleanUrl.includes("v=")) {
        id = cleanUrl.split("v=")[1]?.split(/[?&]/)[0];
      } else if (cleanUrl.includes("/embed/")) {
        id = cleanUrl.split("/embed/")[1]?.split(/[?&]/)[0];
      }
      
      if (id) {
        return `https://www.youtube.com/watch?v=${id}`;
      }
    }
  } catch (e) {
    return cleanUrl;
  }
  return cleanUrl;
};

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
    <div className="flex w-full flex-col 2xl:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
          {liveClass.introVideoUrl ? (
            <div className="absolute inset-0 scale-[1.15] pointer-events-none">
              <ReactPlayer
                url={normalizeStreamUrl(liveClass.introVideoUrl)}
                width="100%"
                height="100%"
                playing={true}
                muted={true}
                loop={true}
                controls={false}
                config={{
                  youtube: {
                    playerVars: { showinfo: 0, controls: 0, disablekb: 1, modestbranding: 1 }
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-900/80 absolute inset-0">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin mb-4 md:mb-6" />
              <p className="text-lg md:text-xl font-medium text-white/50">Waiting for Instructor</p>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10 pointer-events-none">
            <span className="mb-3 md:mb-4 inline-flex w-fit items-center rounded-full bg-orange-500/10 px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-orange-400 border border-orange-500/20 backdrop-blur-md">
              <span className="mr-1.5 md:mr-2 h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" /> Live Event
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 md:mb-3 drop-shadow-2xl tracking-tight line-clamp-2">{liveClass.title}</h1>
            <p className="text-base md:text-xl text-white/80 font-medium drop-shadow-md truncate">with {liveClass.facultyName}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[.045] p-5 md:p-8 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500/20 text-orange-400">
              <Clock size={24} className="md:h-7 md:w-7" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium text-white/50 uppercase tracking-wider mb-1">Status</p>
              <p className="text-lg md:text-xl font-bold text-white">{timeToStart || "Waiting for host..."}</p>
            </div>
          </div>
          <p className="text-sm md:text-base text-white/60 sm:max-w-[200px] md:max-w-sm sm:text-right leading-relaxed">
            The class will start automatically. You do not need to refresh this page.
          </p>
        </div>
      </div>

      <div className="w-full 2xl:w-80 flex flex-col sm:flex-row 2xl:flex-col gap-6 shrink-0">
        <div className="flex-1 rounded-3xl border border-white/10 bg-white/[.045] p-5 md:p-6 backdrop-blur-xl">
          <h3 className="text-base md:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="text-orange-400" size={18} /> Class Rules
          </h3>
          <ul className="space-y-3 text-xs md:text-sm text-white/70">
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              Keep your microphone muted when not speaking.
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              Use the "Raise Hand" feature to ask questions.
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
              Be respectful in the chat window.
            </li>
          </ul>
        </div>

        <div className="flex-1 rounded-3xl border border-white/10 bg-white/[.045] p-5 md:p-6 backdrop-blur-xl">
          <h3 className="text-base md:text-lg font-bold text-white mb-4">System Check</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-medium text-white/80">
                <Wifi size={16} className="text-green-400" /> Connection
              </div>
              <CheckCircle2 size={16} className="text-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-medium text-white/80">
                <Monitor size={16} className="text-green-400" /> Browser
              </div>
              <CheckCircle2 size={16} className="text-green-500" />
            </div>
            <p className="text-[10px] md:text-xs text-white/40 mt-3 md:mt-4 text-center">Everything looks good! Ready to join.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
