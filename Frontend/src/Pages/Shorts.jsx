import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import SEO from "../Components/SEO";
import API from "../api/axios";
import ShortPlayer from "../Components/Shorts/ShortPlayer";
import { Loader2, Volume2, VolumeX } from "lucide-react";

const Shorts = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('stackadda');
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageToken, setPageToken] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [globalMuted, setGlobalMuted] = useState(true);

  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    fetchShorts();
  }, [page, activeTab]);

  useEffect(() => {
    setShorts([]);
    setPage(1);
    setPageToken("");
    setHasMore(true);
    
    if (activeTab === 'global') {
      const queries = ["javascript coding shorts", "python coding tricks", "web development tips", "machine learning shorts", "ai coding tricks", "react js shorts", "css tricks shorts", "html css coding short", "programmer humor shorts"];
      setSearchQuery(queries[Math.floor(Math.random() * queries.length)]);
    }
  }, [activeTab]);

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

  // Global Wheel/Trackpad Navigation (Strict 1-video scrolling everywhere)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isScrolling = false;

    const handleWheel = (e) => {
      // Allow native scroll inside comment modals
      if (e.target.closest('.comment-modal') || e.target.closest('.overflow-y-auto')) return;
      
      // Ignore tiny trackpad movements to prevent accidental scrolls
      if (Math.abs(e.deltaY) < 15) return;

      e.preventDefault();

      if (isScrolling) return;

      const direction = e.deltaY > 0 ? 1 : -1;
      
      isScrolling = true;
      
      const clientHeight = container.clientHeight;
      const currentScroll = container.scrollTop;
      
      const currentIndex = Math.round(currentScroll / clientHeight);
      const nextIndex = currentIndex + direction;
      
      container.scrollTo({ top: nextIndex * clientHeight, behavior: "smooth" });

      setTimeout(() => {
        isScrolling = false;
      }, 700);
    };

    // Attach to window so it catches trackpad ANYWHERE on the screen
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);



  const fetchShorts = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'stackadda' ? '/shorts' : '/shorts/global';
      
      if (page === 1 && id && activeTab === 'stackadda') {
         const [singleRes, listRes] = await Promise.all([
           API.get(`/shorts/${id}`).catch(() => null),
           API.get(`${endpoint}?page=${page}&limit=5`)
         ]);
         
         let initialShorts = listRes.data?.success ? listRes.data.shorts : [];
         if (singleRes && singleRes.data?.success) {
           const specificShort = singleRes.data.short;
           initialShorts = initialShorts.filter(s => s._id !== id);
           initialShorts.unshift(specificShort);
         }
         
         if (initialShorts.length === 0) setHasMore(false);
         else setShorts(initialShorts);
      } else {
         const url = activeTab === 'stackadda' 
             ? `/shorts?page=${page}&limit=5` 
             : `/shorts/global?pageToken=${pageToken}&q=${encodeURIComponent(searchQuery)}&limit=5`;
             
         const res = await API.get(url);
         if (res.data.success) {
           if (res.data.shorts.length === 0) setHasMore(false);
           else {
             if (activeTab === 'global' && res.data.nextPageToken) {
               setPageToken(res.data.nextPageToken);
             } else if (activeTab === 'global' && !res.data.nextPageToken) {
               setHasMore(false);
             }
             setShorts((prev) => {
               const newShorts = res.data.shorts.filter(s => s._id !== id);
               return page === 1 ? newShorts : [...prev, ...newShorts];
             });
           }
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
        <div className="absolute top-[100px] md:top-[120px] z-50 flex gap-2 rounded-full bg-white/10 p-1 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('stackadda')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'stackadda' ? 'bg-orange-500 text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Stack Adda Shorts
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'global' ? 'bg-orange-500 text-white' : 'text-white/70 hover:text-white'
            }`}
          >
            Coding Tricks
          </button>
        </div>
        <h2 className="text-2xl font-bold mt-10">No Shorts Available</h2>
        <p className="text-white/50 mt-2">Check back later for new content!</p>
      </div>
    );
  }

  const activeShort = shorts.find((s) => s._id === activeVideoId) || shorts[0];

  return (
    <>
    <SEO title="Shorts" description="Watch bite-sized coding tutorials and tips on Stack Adda." canonicalUrl="/shorts" />
    <div className="fixed inset-0 z-40 bg-black pt-20 md:pt-24 lg:pt-28">
      <h1 className="sr-only">Stack Adda Shorts</h1>
      
      {/* Top Toggle Switch */}
      <div className="absolute top-[100px] md:top-[120px] left-4 md:left-8 xl:left-[10%] z-50 flex gap-1 rounded-full bg-black/40 p-1 md:p-1.5 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-white/10">
        <button
          onClick={() => setActiveTab('stackadda')}
          className={`rounded-full px-4 py-1.5 text-xs md:px-6 md:py-2.5 md:text-base font-semibold transition-all duration-300 ${
            activeTab === 'stackadda' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          Stack Adda
        </button>
        <button
          onClick={() => setActiveTab('global')}
          className={`rounded-full px-4 py-1.5 text-xs md:px-6 md:py-2.5 md:text-base font-semibold transition-all duration-300 ${
            activeTab === 'global' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          Coding Tricks
        </button>
      </div>

      {/* Global Mute Toggle Button */}
      <button
        onClick={() => setGlobalMuted(!globalMuted)}
        className="absolute top-[100px] md:top-[120px] right-4 md:right-8 xl:right-[10%] z-50 flex items-center gap-2 rounded-full bg-black/40 border border-white/10 px-4 py-1.5 md:px-6 md:py-2.5 text-xs md:text-base font-semibold text-white backdrop-blur-xl transition-all hover:bg-white/20 hover:scale-105 active:scale-95 shadow-lg"
        title="Toggle Mute Globally"
      >
        {globalMuted ? (
          <>
            <VolumeX className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">Unmute</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">Mute</span>
          </>
        )}
      </button>

      {/* Ambient Background Base for Desktop */}
      <div className="fixed inset-0 z-0 hidden md:block overflow-hidden pointer-events-none bg-[#050505]"></div>

      {/* Navigation Helper (Desktop Only) - Left Up Arrow */}
      <div className="absolute left-[5%] lg:left-[8%] xl:left-[12%] top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-4 transition-opacity duration-1000">
        <button 
          onClick={() => {
            if (containerRef.current) {
               containerRef.current.scrollBy({ top: -containerRef.current.clientHeight, behavior: "smooth" });
            }
          }}
          className="group flex flex-col items-center gap-3 rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-2xl p-5 transition-all duration-300 hover:bg-white/10 hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] active:scale-95"
          title="Previous Video"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 shadow-inner group-hover:bg-orange-500/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-orange-400 group-hover:-translate-y-1 transition-all duration-300"><path d="m18 15-6-6-6 6"/></svg>
          </div>
          <p className="text-xs font-bold text-white/50 tracking-[0.2em] uppercase group-hover:text-orange-400 transition-colors">Prev</p>
        </button>
      </div>

      {/* Navigation Helper (Desktop Only) - Right Down Arrow */}
      <div className="absolute right-[5%] lg:right-[8%] xl:right-[12%] top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-4 transition-opacity duration-1000">
        <button 
          onClick={() => {
            if (containerRef.current) {
               containerRef.current.scrollBy({ top: containerRef.current.clientHeight, behavior: "smooth" });
            }
          }}
          className="group flex flex-col items-center gap-3 rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-2xl p-5 transition-all duration-300 hover:bg-white/10 hover:border-orange-500/30 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] active:scale-95"
          title="Next Video"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black/40 shadow-inner group-hover:bg-orange-500/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70 group-hover:text-orange-400 group-hover:translate-y-1 transition-all duration-300"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <p className="text-xs font-bold text-white/50 tracking-[0.2em] uppercase group-hover:text-orange-400 transition-colors">Next</p>
        </button>
      </div>

      {/* Absolute wrapper to guarantee explicit height for the scroll container */}
      <div className="relative z-10 h-full w-full">
        <div
          ref={containerRef}
          className="absolute inset-0 overflow-y-scroll snap-y snap-mandatory scrollbar-hide overscroll-contain touch-pan-y"
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
    </>
  );
}

export default Shorts;
