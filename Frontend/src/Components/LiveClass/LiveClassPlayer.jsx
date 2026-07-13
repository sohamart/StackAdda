import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { LogOut } from "lucide-react";
import API from "../../api/axios";

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

export default function LiveClassPlayer({ liveClass, user, onLeave }) {
  useEffect(() => {
    // Log attendance join
    API.post(`/live-class/${liveClass._id}/attendance`, { action: "join" }).catch(console.error);

    return () => {
      // Log attendance leave on unmount
      API.post(`/live-class/${liveClass._id}/attendance`, { action: "leave" }).catch(console.error);
    };
  }, [liveClass._id]);

  const streamUrl = normalizeStreamUrl(liveClass.streamUrl);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl relative group">
      {/* Header bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h2 className="text-xl font-bold text-white drop-shadow-md">{liveClass.title}</h2>
        <button 
          onClick={onLeave}
          className="flex items-center gap-2 rounded-xl bg-red-500/80 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 backdrop-blur-md transition-all shadow-lg"
        >
          <LogOut size={16} /> Leave Class
        </button>
      </div>

      {/* Player */}
      <div className="flex-1 bg-black flex items-center justify-center relative w-full h-full">
        {streamUrl ? (
          <div className="absolute inset-0">
            <ReactPlayer 
              url={streamUrl}
              width="100%"
              height="100%"
              playing={true}
              controls={true}
              config={{
                youtube: {
                  playerVars: { showinfo: 1 }
                }
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-white/50 h-full w-full bg-zinc-900 absolute inset-0">
            <div className="h-16 w-16 mb-4 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin" />
            <p className="text-xl font-medium animate-pulse">Waiting for broadcast to start...</p>
          </div>
        )}
      </div>
    </div>
  );
}
