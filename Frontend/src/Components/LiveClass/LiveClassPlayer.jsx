import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";

import {
  LogOut,
  Maximize2,
  Minimize2,
  Wifi,
  WifiOff,
  Loader2,
  PlayCircle,
  Clock3,
  Radio,
  Users,
  ShieldCheck,
} from "lucide-react";

import API from "../../api/axios";
import ProtectedVideoWrapper from "./ProtectedVideoWrapper";

/* ======================================================
   Extract Youtube ID
====================================================== */

const getYoutubeId = (url) => {
  if (!url) return null;

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([^?&/]+)/
  );

  return match ? match[1] : null;
};

export default function LiveClassPlayer({
  liveClass,
  onLeave,
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const [watchTime, setWatchTime] = useState(0);

  const [fullscreen, setFullscreen] = useState(false);

  const [online, setOnline] = useState(navigator.onLine);

  const [viewerCount, setViewerCount] = useState(1);

  const ytId = useMemo(
    () => getYoutubeId(liveClass?.streamUrl),
    [liveClass]
  );

  const streamUrl = liveClass?.streamUrl;

  /* ===========================================
      Watch Timer
  =========================================== */

  useEffect(() => {

    const timer = setInterval(() => {
      setWatchTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);

  }, []);

  const formatTime = (sec) => {

    const h = Math.floor(sec / 3600);

    const m = Math.floor((sec % 3600) / 60);

    const s = sec % 60;

    return [h, m, s]
      .map((i) => String(i).padStart(2, "0"))
      .join(":");

  };

  /* ===========================================
      Network
  =========================================== */

  useEffect(() => {

    const on = () => setOnline(true);

    const off = () => setOnline(false);

    window.addEventListener("online", on);

    window.addEventListener("offline", off);

    return () => {

      window.removeEventListener("online", on);

      window.removeEventListener("offline", off);

    };

  }, []);

  /* ===========================================
      Attendance
  =========================================== */

  useEffect(() => {

    if (!liveClass?._id) return;

    API.post(`/live-class/${liveClass._id}/attendance`, {
      action: "join",
    }).catch(() => {});

    return () => {

      API.post(`/live-class/${liveClass._id}/attendance`, {
        action: "leave",
      }).catch(() => {});

    };

  }, [liveClass]);

  /* ===========================================
      Browser Close
  =========================================== */

  useEffect(() => {

    if (!liveClass?._id) return;

    const unload = () => {

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

    };

    window.addEventListener(
      "beforeunload",
      unload
    );

    return () =>
      window.removeEventListener(
        "beforeunload",
        unload
      );

  }, [liveClass]);

  /* ===========================================
      Fullscreen
  =========================================== */

  const toggleFullscreen = async () => {

    try {

      if (!document.fullscreenElement) {

        await containerRef.current?.requestFullscreen();

      } else {

        await document.exitFullscreen();

      }

    } catch {}

  };

  useEffect(() => {

    const change = () =>
      setFullscreen(!!document.fullscreenElement);

    document.addEventListener(
      "fullscreenchange",
      change
    );

    return () =>
      document.removeEventListener(
        "fullscreenchange",
        change
      );

  }, []);


  /* ===========================================
      Leave Class
  =========================================== */

  const handleLeave = async () => {
    try {
      await API.post(`/live-class/${liveClass._id}/attendance`, {
        action: "leave",
      });
    } catch {}

    onLeave?.();
  };

  /* ===========================================
      Keyboard Shortcuts
  =========================================== */

  useEffect(() => {
    const handler = (e) => {
      if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      }

      if (
        e.key === "Escape" &&
        document.fullscreenElement
      ) {
        document.exitFullscreen();
      }
    };

    window.addEventListener("keydown", handler);

    return () =>
      window.removeEventListener("keydown", handler);
  }, []);

  /* ===========================================
      UI
  =========================================== */

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#050505]"
    >
      {/* Orange Glow */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[350px] w-[700px] -translate-x-1/2 rounded-full bg-orange-500/20 blur-[140px]" />

      {/* ================= HEADER ================= */}

      <div className="relative z-20 border-b border-white/10 bg-black/60 backdrop-blur-xl">

        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4">

          {/* Left */}

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-3">

              <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1.5">

                <span className="relative flex h-2.5 w-2.5">

                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500" />

                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />

                </span>

                <span className="text-xs font-bold tracking-[3px] text-red-400">
                  LIVE
                </span>

              </div>

              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">

                {online ? (
                  <>
                    <Wifi size={14} className="text-green-400" />
                    <span className="text-xs text-green-400">
                      Connected
                    </span>
                  </>
                ) : (
                  <>
                    <WifiOff size={14} className="text-red-400" />
                    <span className="text-xs text-red-400">
                      Offline
</span>
</>

)}
                </div>

<div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
  <Users size={14} className="text-orange-400" />
  <span className="text-xs">
    {viewerCount} Watching
  </span>
</div>

</div>

<h1 className="mt-4 line-clamp-2 text-xl font-bold text-white md:text-3xl">
  {liveClass?.title}
</h1>

<div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-white/60">
  <div className="flex items-center gap-2">
    <Clock3 size={15} className="text-orange-400" />
    {formatTime(watchTime)}
  </div>

  <div className="flex items-center gap-2">
    <ShieldCheck size={15} className="text-green-400" />
    Protected Stream
  </div>
</div>

</div>

<div className="flex items-center gap-3">

<button
  onClick={toggleFullscreen}
  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5"
>
  {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
</button>

<button
  onClick={handleLeave}
  className="flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-white"
>
  <LogOut size={17} />
  <span className="hidden sm:block">
    Leave Class
  </span>
</button>

</div>

</div>

</div>
                           {/* ================= PLAYER ================= */}

      <div
  className={`relative flex flex-1 items-center justify-center bg-black ${
    fullscreen ? "p-0" : "px-2 py-3 sm:px-4 lg:px-8"
  }`}
>
        {/* Cinema Glow */}

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,.12),transparent_60%)]" />

        {/* 16:9 Player */}

        <div
  className={`relative overflow-hidden border border-white/10 bg-black shadow-[0_0_80px_rgba(249,115,22,.15)]
  ${
    fullscreen
      ? "w-screen h-[100dvh] max-w-none rounded-none"
      : "mx-auto w-full max-w-7xl aspect-video rounded-2xl"
  }`}
>

          <ProtectedVideoWrapper>

            {/* Loading */}

            {loading && (
              <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black">

                <Loader2
                  className="h-12 w-12 animate-spin text-orange-500"
                />

                <h2 className="mt-5 text-xl font-bold text-white">
                  Connecting Live Stream
                </h2>

                <p className="mt-2 text-sm text-white/50">
                  Please wait...
                </p>

              </div>
            )}

            {/* Youtube */}

            {ytId ? (

              <iframe
                title="Stack Adda Live"

                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}

                className="absolute inset-0 h-full w-full"

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
                onReady={() => setLoading(false)}
                style={{
                  position: "absolute",
                  inset: 0,
                }}
              />

            ) : (

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">

                <div className="relative">

                  <div className="absolute inset-0 rounded-full bg-orange-500/30 blur-3xl animate-pulse" />

                  <PlayCircle
                    className="relative h-20 w-20 text-orange-500"
                  />

                </div>

                <h2 className="mt-8 text-2xl font-bold text-white">
                  Waiting for Teacher
                </h2>

                <p className="mt-3 max-w-md px-5 text-center text-white/60">

                  The live class hasn't started yet.
                  Stay on this page and the stream
                  will begin automatically.

                </p>

              </div>

            )}

          </ProtectedVideoWrapper>

          {/* Bottom Gradient */}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-black via-black/50 to-transparent lg:block" />

        </div>
      </div>

                            {/* ================= Fullscreen Hint ================= */}

      {!fullscreen && (
        <div
          className="
            absolute
            bottom-6
            right-6
            hidden
            lg:flex
            items-center
            gap-2
            rounded-xl
            border
            border-white/10
            bg-black/60
            backdrop-blur-xl
            px-4
            py-2
            text-xs
            text-white/70
          "
        >
          <Maximize2 className="h-4 w-4 text-orange-400" />

          <span>
            Press <strong>F</strong> for Fullscreen
          </span>
        </div>
      )}

      {/* ================= Mobile Live Badge ================= */}

      <div
        className="
          absolute
          bottom-5
          left-1/2
          -translate-x-1/2
          lg:hidden
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-red-500/30
            bg-black/70
            px-4
            py-2
            backdrop-blur-xl
          "
        >
          <span className="relative flex h-2.5 w-2.5">

            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500" />

            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />

          </span>

          <span className="text-xs font-bold tracking-widest text-red-400">
            LIVE
          </span>
        </div>
      </div>

      {/* ================= Footer ================= */}

      <div
        className="
          border-t
          border-white/10
          bg-black/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            items-center
            justify-between
            gap-3
            px-4
            py-4
            text-xs
            text-white/50
            sm:flex-row
          "
        >
          <div>
            Powered by{" "}
            <span className="font-semibold text-orange-500">
              Stack Adda Live
            </span>
          </div>

          <div className="flex items-center gap-5">

            <span>
              Watch Time: {formatTime(watchTime)}
            </span>

            <span className="hidden sm:block">
              Protected Live Stream
            </span>

          </div>
        </div>
      </div>

    </div>
  );
}
