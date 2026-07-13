import React, { useEffect } from "react";
import { LogOut } from "lucide-react";
import API from "../../api/axios";

const getYoutubeVideoId = (url) => {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }

    if (parsed.pathname.startsWith("/live/")) {
      return parsed.pathname.split("/live/")[1];
    }

    if (parsed.pathname.startsWith("/embed/")) {
      return parsed.pathname.split("/embed/")[1];
    }

    return parsed.searchParams.get("v") || "";
  } catch {
    return "";
  }
};

export default function LiveClassPlayer({
  liveClass,
  user,
  onLeave,
}) {
  useEffect(() => {
    API.post(`/live-class/${liveClass._id}/attendance`, {
      action: "join",
    }).catch(console.error);

    return () => {
      API.post(`/live-class/${liveClass._id}/attendance`, {
        action: "leave",
      }).catch(console.error);
    };
  }, [liveClass._id]);

  const videoId = getYoutubeVideoId(liveClass.streamUrl);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl relative group">

      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
        <h2 className="text-xl font-bold text-white">
          {liveClass.title}
        </h2>

        <button
          onClick={onLeave}
          className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition"
        >
          <LogOut size={16} />
          Leave Class
        </button>
      </div>

      <div className="relative flex-1 bg-black">

        {videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`}
            title="YouTube Live"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            Waiting for Live...
          </div>
        )}

      </div>
    </div>
  );
}
