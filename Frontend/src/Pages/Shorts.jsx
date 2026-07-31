import React, { useState, useEffect, useRef } from "react";
import API from "../api/axios";
import ShortPlayer from "../Components/Shorts/ShortPlayer";
import { Loader2 } from "lucide-react";

const Shorts = () => {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [globalMuted, setGlobalMuted] = useState(true);

  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    fetchShorts();
  }, [page]);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current) return;
      // Don't intercept if user is typing in an input (like comments)
      if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        containerRef.current.scrollBy({ top: window.innerHeight, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        containerRef.current.scrollBy({ top: -window.innerHeight, behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchShorts = async () => {
    try {
      const res = await API.get(`/shorts?page=${page}&limit=5`);
      if (res.data.success) {
        if (res.data.shorts.length === 0) {
          setHasMore(false);
        } else {
          setShorts((prev) => (page === 1 ? res.data.shorts : [...prev, ...res.data.shorts]));
        }
      }
    } catch (error) {
      console.error("Error fetching shorts", error);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    const loaderObserver = new IntersectionObserver(handleObserver, {
      root: containerRef.current,
      threshold: 0.1,
    });

    if (loaderRef.current) {
      loaderObserver.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) loaderObserver.unobserve(loaderRef.current);
    };
  }, [hasMore, loading]);

  // Intersection Observer for Active Video (Autoplay/Pause)
  useEffect(() => {
    const options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.7, // Trigger when 70% visible
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveVideoId(entry.target.getAttribute("data-id"));
        }
      });
    }, options);

    const videoElements = document.querySelectorAll(".short-container");
    videoElements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [shorts]);

  if (loading && page === 1) {
    return (
      <div className="flex h-screen items-center justify-center bg-black pt-20">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
      </div>
    );
  }

  if (shorts.length === 0 && !loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-black text-white pt-20">
        <h2 className="text-2xl font-bold">No Shorts Available</h2>
        <p className="text-white/50 mt-2">Check back later for new content!</p>
      </div>
    );
  }

  const activeShort = shorts.find((s) => s._id === activeVideoId) || shorts[0];

  return (
    <div className="fixed inset-0 z-40 bg-black pt-20 md:pt-24 lg:pt-28">
      {/* Ambient Background Glow for Desktop */}
      {activeShort && (
        <div className="absolute inset-0 z-0 hidden md:block overflow-hidden pointer-events-none transition-all duration-700 ease-in-out">
          <img
            key={activeShort._id}
            src={activeShort.thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-[120px] opacity-40 scale-110"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      )}

      {/* Keyboard Navigation Helper (Desktop Only) */}
      <div className="absolute right-[5%] lg:right-[10%] xl:right-[15%] top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-4 text-white/50 pointer-events-none transition-opacity duration-1000">
        <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl px-8 py-10 flex flex-col items-center gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <kbd className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 font-sans text-3xl font-bold text-white shadow-inner animate-bounce">
            ↓
          </kbd>
          <div className="text-center">
            <p className="text-lg font-bold text-white tracking-wide">Down Arrow</p>
            <p className="text-sm font-medium text-white/60 mt-1 uppercase tracking-widest">Next Video</p>
          </div>
        </div>
      </div>

      {/* Absolute wrapper to guarantee explicit height for the scroll container */}
      <div className="relative z-10 h-full w-full">
        {/* Scroll Snapping Container */}
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        >
          {shorts.map((short, index) => (
            <div
              key={`${short._id}-${index}`}
              data-id={short._id}
              className="short-container h-full w-full flex justify-center bg-transparent"
            >
            <ShortPlayer
              short={short}
              isActive={activeVideoId === short._id || (!activeVideoId && index === 0)}
              globalMuted={globalMuted}
              setGlobalMuted={setGlobalMuted}
            />
          </div>
        ))}
        
        {/* Infinite Scroll Loader Trigger */}
        {hasMore ? (
          <div ref={loaderRef} className="h-20 w-full flex items-center justify-center snap-start">
            <Loader2 className="h-6 w-6 animate-spin text-white/50" />
          </div>
        ) : (
          <div className="h-20 w-full flex flex-col items-center justify-center snap-start pb-8">
            <div className="h-[2px] w-12 bg-white/20 rounded mb-2"></div>
            <p className="text-white/50 text-sm font-medium">End of shorts.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Shorts;
