import React, { useRef, useState, useEffect } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import ShortSidebar from "./ShortSidebar";
import CommentModal from "./CommentModal";
import ShareModal from "./ShareModal";
import LikesModal from "./LikesModal";
import API from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";

const ShortPlayer = ({ short, isActive, isAdjacent, globalMuted, setGlobalMuted, onRefreshFeed }) => {
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    setIsPlaying(isActive);
    if (!isActive) {
      setIsVideoLoaded(false);
    }
    if (isActive) {
      API.post(`/shorts/${short._id}/view`).catch(console.error);
    }
  }, [isActive, short._id]);

  useEffect(() => {
    const func = isActive ? "playVideo" : "pauseVideo";
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(`{"event":"command","func":"${func}","args":""}`, "*");
    }
  }, [isActive]);

  // Listen for YouTube iframe state changes to detect loop
  useEffect(() => {
    const handleMessage = (event) => {
      if (iframeRef.current && event.source === iframeRef.current.contentWindow) {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "onStateChange" && data.info === 0) {
            // Video ended, about to loop. Show loading animation.
            setIsVideoLoaded(false);
            // Hide it after a short delay so the animation is clearly visible
            setTimeout(() => setIsVideoLoaded(true), 800);
          }
        } catch (e) {}
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const togglePlay = () => {
    const func = isPlaying ? "pauseVideo" : "playVideo";
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(`{"event":"command","func":"${func}","args":""}`, "*");
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative h-full w-full bg-transparent flex items-center justify-center snap-start snap-always scroll-m-0 overflow-hidden md:py-4">
      
      {/* Real-time Moving Ambient Reflection (Desktop Only) */}
      {isActive && (
        <div className="absolute inset-0 z-0 hidden md:flex items-center justify-center pointer-events-none">
          <div 
            className="absolute w-[80vw] h-[80vh] blur-[80px] opacity-[0.55]"
            style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 15%, transparent 75%)' }}
          >
            {/* Pulse Animated Thumbnail to act as reflection without sync issues */}
            <img src={short.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover scale-[1.3] pointer-events-none animate-[pulse_4s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      {/* Main Video Wrapper (no overflow-hidden so shadow can bleed) */}
      <div className="relative z-10 h-full w-full md:h-full md:w-auto md:aspect-[9/16] group">
        
        {/* Pulsing Outer Glow (Behind the video so inward bleed is hidden) */}
        <div className="absolute inset-0 z-0 pointer-events-none md:rounded-[2rem] shadow-[0_0_30px_rgba(249,115,22,0.15)] animate-[pulse_3s_ease-in-out_infinite]"></div>

        {/* Video Inner Container (has overflow-hidden for video cropping) */}
        <div className="relative h-full w-full bg-black md:rounded-[2rem] overflow-hidden z-10">
          
        {/* Thumbnail Background */}
        <img 
          src={short.thumbnail} 
          alt={short.title} 
          className="absolute top-0 left-0 w-full h-full object-cover opacity-40 z-0"
        />

        {/* YouTube Iframe (Only mounted when active) */}
        {isActive && (
          <div 
            className="absolute inset-0 z-[5] cursor-pointer"
            onClick={() => {
              if (globalMuted) {
                setGlobalMuted(false);
              } else {
                togglePlay();
              }
            }}
          >
            <iframe
              ref={iframeRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              src={`https://www.youtube.com/embed/${short.videoId}?autoplay=1&mute=${globalMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${short.videoId}&enablejsapi=1&disablekb=1&iv_load_policy=3`}
              title={short.title}
              onLoad={() => {
                setIsVideoLoaded(true);
                // Register state change listener when iframe loads
                if (iframeRef.current && iframeRef.current.contentWindow) {
                  iframeRef.current.contentWindow.postMessage(JSON.stringify({
                    event: "command",
                    func: "addEventListener",
                    args: ["onStateChange"]
                  }), "*");
                }
              }}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        )}

        {/* Top Gradient Overlay to hide YouTube Title Bar */}
        <div 
          className="absolute top-0 left-0 right-0 h-[100px] z-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
            backdropFilter: 'blur(8px)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
          }}
        ></div>

        {/* Loading Animated Logo Overlay */}
        <AnimatePresence>
          {!isVideoLoaded && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[15] flex items-center justify-center bg-black/80 backdrop-blur-md pointer-events-none"
            >
              <div className="relative flex items-center justify-center animate-pulse">
                <div className="absolute inset-0 bg-orange-500/30 blur-[40px] rounded-full scale-150" />
                <img src="/favicon.png" alt="Loading..." className="w-16 h-auto relative z-10" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play Button Overlay (when paused manually) */}
        <AnimatePresence>
          {!isPlaying && isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.2, type: "spring", stiffness: 200 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <Play size={36} className="fill-white text-white ml-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tap to Unmute Overlay */}
        <AnimatePresence>
          {globalMuted && isActive && isVideoLoaded && isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
            >
              <div className="flex flex-col items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-pulse">
                <VolumeX size={24} className="text-white drop-shadow-md" />
                <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest drop-shadow-md">Tap to Unmute</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Dark Gradient Overlay with smooth faded blur and subtle orange tint */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[45%] pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(249,115,22,0.05) 50%, transparent 100%)',
            backdropFilter: 'blur(8px)',
            WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
            maskImage: 'linear-gradient(to top, black 40%, transparent 100%)'
          }}
        ></div>

        {/* Video Info (Bottom Left) */}
        <div className="absolute bottom-8 left-5 right-20 z-20 pointer-events-none">
          <h3 className="text-white font-bold text-base sm:text-lg leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {short.title}
          </h3>
          {short.description && (
            <p className="text-white/80 text-sm mt-2.5 line-clamp-2 drop-shadow-lg font-medium leading-relaxed max-w-[90%]">
              {short.description}
            </p>
          )}
        </div>

        {/* Sidebar Controls */}
          <ShortSidebar 
            short={short} 
            onOpenComments={() => setIsCommentModalOpen(true)} 
            onOpenShare={() => setIsShareModalOpen(true)}
            onOpenLikes={() => setIsLikesModalOpen(true)}
            onRefreshFeed={onRefreshFeed}
          />
        </div>

        {/* Crisp Pulsing Outline (On top of video to prevent being hidden) */}
        <div className="absolute inset-0 z-20 pointer-events-none md:rounded-[2rem] md:border border-orange-500/50 animate-[pulse_3s_ease-in-out_infinite]"></div>
      </div>

      {/* Modals */}
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        shortId={short._id}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shortId={short._id}
      />
      <LikesModal
        isOpen={isLikesModalOpen}
        onClose={() => setIsLikesModalOpen(false)}
        shortId={short._id}
      />
    </div>
  );
};

export default ShortPlayer;
