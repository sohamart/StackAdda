import React, { useState, useEffect, useRef } from "react";
import { Clock, Shield, Wifi, Monitor, CheckCircle2, Volume2, VolumeX } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import ReactPlayer from "react-player";

const getYoutubeId = (url) => {
  if (!url) return null;
  let cleanUrl = url.trim();
  try {
    const isYouTube = cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be");
    if (isYouTube) {
      if (cleanUrl.includes("youtu.be/")) return cleanUrl.split("youtu.be/")[1]?.split(/[?&]/)[0];
      if (cleanUrl.includes("/live/")) return cleanUrl.split("/live/")[1]?.split(/[?&]/)[0];
      if (cleanUrl.includes("v=")) return cleanUrl.split("v=")[1]?.split(/[?&]/)[0];
      if (cleanUrl.includes("/embed/")) return cleanUrl.split("/embed/")[1]?.split(/[?&]/)[0];
    }
  } catch (e) {}
  return null;
};

const normalizeStreamUrl = (url) => {
  return url ? url.trim() : url;
};

export default function WaitingRoom({ liveClass }) {
  const [timeToStart, setTimeToStart] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

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
  console.log(liveClass.introVideoUrl);

  return (
    <div className="flex w-full flex-col 2xl:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-6">
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
          {liveClass.introVideoUrl ? (() => {
            const ytId = getYoutubeId(liveClass.introVideoUrl);
            return (
              <>
                {ytId ? (
                  <div className="absolute inset-0 z-20">
                    <iframe 
                      src={`https://www.youtube.com/embed/${ytId}?autoplay=1&controls=1&modestbranding=1`}
                      title="Waiting Room Video"
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen 
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 pointer-events-none scale-[1.02]">
                    <video
                      ref={videoRef}
                      src={normalizeStreamUrl(liveClass.introVideoUrl)}
                      className="absolute inset-0 w-full h-full object-cover"
                      autoPlay
                      loop
                      playsInline
                      controls={false}
                    />
                  </div>
                )}
              </>
            );
          })() : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-900/80 absolute inset-0">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin mb-4 md:mb-6" />
              <p className="text-lg md:text-xl font-medium text-white/50">Waiting for Instructor</p>
            </div>
          )}
          
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 md:p-6 pointer-events-none">
            <span className="mb-2 md:mb-3 inline-flex w-fit items-center rounded-full bg-orange-500/10 px-2.5 md:px-3 py-1 md:py-1.5 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-orange-400 border border-orange-500/20 backdrop-blur-md">
              <span className="mr-1.5 md:mr-2 h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" /> Live Event
            </span>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg line-clamp-1">{liveClass.title}</h1>
            <p className="text-sm md:text-base text-white/80 font-medium drop-shadow-md truncate">with {liveClass.facultyName}</p>
          </div>

          {/* Sound Control Overlay (Only for Uploaded Videos) */}
          {liveClass.introVideoUrl && !getYoutubeId(liveClass.introVideoUrl) && (
            <div className="absolute bottom-4 right-4 z-10">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="flex items-center gap-2 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition-all shadow-lg"
              >
                {isMuted ? (
                  <>
                    <VolumeX size={18} className="text-white/70" />
                    <span className="hidden sm:inline">Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={18} className="text-white" />
                    <span className="hidden sm:inline">Mute</span>
                  </>
                )}
              </button>
            </div>
          )}
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
