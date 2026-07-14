import React, { useEffect, useState, useRef } from "react";
import ReactPlayer from "react-player";
import {
  LogOut,
  Maximize,
  Minimize,
  Wifi,
  WifiOff,
  Loader2,
  PlayCircle
} from "lucide-react";
import API from "../../api/axios";

/* ----------------------------------------
   Extract YouTube Video ID
----------------------------------------- */
const getYoutubeId = (url) => {
  if (!url) return null;

  try {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|live\/|embed\/)|youtu\.be\/)([^?&/]+)/
    );

    return match ? match[1] : null;
  } catch {
    return null;
  }
};

export default function LiveClassPlayer({
  liveClass,
  onLeave,
}) {

  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [watchTime, setWatchTime] = useState(0);

  const ytId = getYoutubeId(liveClass?.streamUrl);
  const streamUrl = liveClass?.streamUrl;

  /* ----------------------------------------
      Watch Timer
  ----------------------------------------- */

  useEffect(() => {

    const timer = setInterval(() => {
      setWatchTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  const formatTime = (sec) => {

    const h = Math.floor(sec / 3600);

    const m = Math.floor((sec % 3600) / 60);

    const s = sec % 60;

    return [
      h.toString().padStart(2, "0"),
      m.toString().padStart(2, "0"),
      s.toString().padStart(2, "0"),
    ].join(":");

  };

  /* ----------------------------------------
      Internet Detection
  ----------------------------------------- */

  useEffect(() => {

    const online = () => setIsOnline(true);

    const offline = () => setIsOnline(false);

    window.addEventListener("online", online);

    window.addEventListener("offline", offline);

    return () => {

      window.removeEventListener("online", online);

      window.removeEventListener("offline", offline);

    };

  }, []);
  /* ----------------------------------------
   Attendance System
----------------------------------------- */

useEffect(() => {
  if (!liveClass?._id) return;

  API.post(`/live-class/${liveClass._id}/attendance`, {
    action: "join",
  }).catch(console.error);

  return () => {
    API.post(`/live-class/${liveClass._id}/attendance`, {
      action: "leave",
    }).catch(console.error);
  };
}, [liveClass?._id]);

/* ----------------------------------------
   Leave on Browser Close / Refresh
----------------------------------------- */

useEffect(() => {
  if (!liveClass?._id) return;

  const handleUnload = () => {
    try {
      navigator.sendBeacon(
        `${API.defaults.baseURL}/live-class/${liveClass._id}/attendance`,
        new Blob(
          [
            JSON.stringify({
              action: "leave",
            }),
          ],
          {
            type: "application/json",
          }
        )
      );
    } catch (err) {}
  };

  window.addEventListener("beforeunload", handleUnload);

  return () => {
    window.removeEventListener("beforeunload", handleUnload);
  };
}, [liveClass?._id]);

/* ----------------------------------------
   Fullscreen
----------------------------------------- */

const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      }
    }
  } catch (err) {
    console.log(err);
  }
};

useEffect(() => {
  const change = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  document.addEventListener("fullscreenchange", change);

  return () => {
    document.removeEventListener("fullscreenchange", change);
  };
}, []);

/* ----------------------------------------
   Leave Class
----------------------------------------- */

const handleLeave = async () => {
  try {
    await API.post(`/live-class/${liveClass._id}/attendance`, {
      action: "leave",
    });
  } catch {}

  onLeave();
};

/* ----------------------------------------
   Keyboard Shortcuts
----------------------------------------- */

useEffect(() => {
  const keyHandler = (e) => {
    // Fullscreen
    if (e.key.toLowerCase() === "f") {
      toggleFullscreen();
    }

    // Space = Play / Pause
    if (e.code === "Space") {
      e.preventDefault();
    }

    // ESC Leave Fullscreen
    if (e.key === "Escape") {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  };

  window.addEventListener("keydown", keyHandler);

  return () => {
    window.removeEventListener("keydown", keyHandler);
  };
}, []);

/* ----------------------------------------
   Retry Stream
----------------------------------------- */

const retryStream = () => {
  setLoading(true);

  setTimeout(() => {
    setLoading(false);
  }, 1200);
};

return (
  <div
    ref={containerRef}
    className="relative w-full min-h-[100dvh] bg-black overflow-hidden flex flex-col"
  >

    {/* ================= HEADER ================= */}

    <div className="
      absolute
      top-0
      left-0
      right-0
      z-30
      flex
      flex-col
      lg:flex-row
      lg:items-center
      justify-between
      gap-4
      p-4
      lg:p-6
      bg-gradient-to-b
      from-black/95
      via-black/60
      to-transparent
      backdrop-blur-md
    ">

      {/* Left Section */}

      <div className="flex flex-col gap-3">

        {/* LIVE Badge */}

        <div className="flex items-center gap-3">

          <div
            className="
            flex
            items-center
            gap-2
            rounded-full
            bg-red-500/20
            border
            border-red-500/40
            px-4
            py-2
          "
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 animate-ping"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
            </span>

            <span className="text-xs font-bold uppercase tracking-[3px] text-red-400">
              LIVE
            </span>
          </div>

          {/* Internet */}

          <div
            className="
              flex
              items-center
              gap-2
              rounded-full
              border
              border-white/10
              bg-white/5
              px-3
              py-2
            "
          >
            {isOnline ? (
              <>
                <Wifi className="h-4 w-4 text-green-400" />
                <span className="text-xs text-green-400">
                  Connected
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-400" />
                <span className="text-xs text-red-400">
                  Offline
                </span>
              </>
            )}
          </div>

        </div>

        {/* Title */}

        <div>

          <h1
            className="
            text-lg
            sm:text-xl
            lg:text-3xl
            font-bold
            text-white
            line-clamp-2
          "
          >
            {liveClass?.title}
          </h1>

          <p className="mt-1 text-sm text-orange-400">
            Watch Time • {formatTime(watchTime)}
          </p>

        </div>

      </div>

      {/* Right Buttons */}

      <div
        className="
        flex
        items-center
        gap-3
        flex-wrap
      "
      >

        {/* Fullscreen */}

        <button
          onClick={toggleFullscreen}
          className="
          h-11
          w-11
          rounded-xl
          bg-white/10
          border
          border-white/10
          flex
          items-center
          justify-center
          hover:bg-orange-500
          transition-all
          duration-300
        "
        >

          {isFullscreen ? (
            <Minimize className="h-5 w-5 text-white" />
          ) : (
            <Maximize className="h-5 w-5 text-white" />
          )}

        </button>

        {/* Leave */}

        <button
          onClick={handleLeave}
          className="
          flex
          items-center
          gap-2
          rounded-xl
          bg-red-500
          hover:bg-red-600
          active:scale-95
          transition-all
          px-5
          h-11
          font-semibold
          text-white
        "
        >
          <LogOut className="h-4 w-4" />

          <span className="hidden sm:block">
            Leave Class
          </span>

        </button>

      </div>

    </div>

    {/* ================= PLAYER START ================= */}

    <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
            {/* ================= VIDEO PLAYER ================= */}

      <div className="relative w-full aspect-video max-h-[100dvh] bg-black overflow-hidden rounded-xl">

        {loading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black">

            <Loader2
              className="h-12 w-12 animate-spin text-orange-500"
            />

            <p className="mt-4 text-white/70 text-sm tracking-wide">
              Loading Live Stream...
            </p>

          </div>
        )}

        {ytId ? (

          <iframe
            title="Live Stream"

            src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}

            className="
              absolute
              inset-0
              w-full
              h-full
              border-0
            "

            allow="
              accelerometer;
              autoplay;
              clipboard-write;
              encrypted-media;
              gyroscope;
              picture-in-picture;
              web-share
            "

            allowFullScreen

            referrerPolicy="strict-origin-when-cross-origin"

            onLoad={() => setLoading(false)}

          />

        ) : streamUrl ? (

          <ReactPlayer
  ref={playerRef}
  url={streamUrl}
  width="100%"
  height="100%"
  playing
  controls
  style={{
    position: "absolute",
    inset: 0,
  }}
/>

        ) : (

          <div
            className="
              absolute
              inset-0
              flex
              flex-col
              items-center
              justify-center
              bg-gradient-to-br
              from-black
              via-zinc-900
              to-black
            "
          >

            <div
              className="
                relative
                flex
                items-center
                justify-center
              "
            >

              <div
                className="
                  absolute
                  h-28
                  w-28
                  rounded-full
                  bg-orange-500/20
                  blur-3xl
                  animate-pulse
                "
              />

              <PlayCircle
                className="
                  h-20
                  w-20
                  text-orange-500
                "
              />

            </div>

            <h2
              className="
                mt-8
                text-xl
                sm:text-2xl
                font-bold
                text-white
              "
            >
              Waiting for Live Broadcast
            </h2>

            <p
              className="
                mt-3
                max-w-md
                px-6
                text-center
                text-sm
                text-white/60
              "
            >
              The teacher hasn't started the live class yet.
              Please stay on this page.
            </p>

          </div>

        )}

      </div>
            {/* ================= Bottom Overlay ================= */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          hidden
          md:block
          h-28
          bg-gradient-to-t
          from-black/90
          via-black/40
          to-transparent
          pointer-events-none
        "
      />

      {/* ================= Fullscreen Hint ================= */}

      {!isFullscreen && (
        <div
          className="
            absolute
            bottom-5
            right-5
            hidden
            lg:flex
            items-center
            gap-2
            rounded-xl
            bg-black/60
            backdrop-blur-xl
            border
            border-white/10
            px-4
            py-2
            text-xs
            text-white/70
          "
        >
          <Maximize className="w-4 h-4 text-orange-400" />
          Press <span className="font-bold text-white">F</span> for Fullscreen
        </div>
      )}

      {/* ================= Mobile Live Badge ================= */}

      <div
        className="
          md:hidden
          absolute
          bottom-4
          left-1/2
          -translate-x-1/2
          z-20
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            bg-black/70
            backdrop-blur-lg
            border
            border-red-500/30
            px-4
            py-2
          "
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 animate-ping"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </span>

          <span className="text-xs font-semibold tracking-widest text-red-400 uppercase">
            LIVE
          </span>
        </div>
      </div>

    </div>

    {/* ================= Footer ================= */}

    <div
      className="
        flex
        items-center
        justify-between
        px-4
        py-3
        border-t
        border-white/10
        bg-black
      "
    >
      <div className="text-xs text-white/50">
        Powered by <span className="text-orange-500 font-semibold">Stack Adda Live</span>
      </div>

      <div className="text-xs text-white/40">
        Watch Time: {formatTime(watchTime)}
      </div>
    </div>

  </div>
);
}