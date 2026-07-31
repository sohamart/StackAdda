import React, { useRef, useState, useEffect } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import ShortSidebar from "./ShortSidebar";
import CommentModal from "./CommentModal";
import ShareModal from "./ShareModal";
import API from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";

const ShortPlayer = ({ short, isActive, globalMuted, setGlobalMuted }) => {
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    setIsPlaying(isActive);
    if (isActive) {
      API.post(`/shorts/${short._id}/view`).catch(console.error);
    }
  }, [isActive, short._id]);

  // Sync isPlaying with isActive when it changes
  useEffect(() => {
    if (iframeRef.current) {
      const func = isActive ? "playVideo" : "pauseVideo";
      iframeRef.current.contentWindow.postMessage(`{"event":"command","func":"${func}","args":""}`, "*");
    }
  }, [isActive]);

  const togglePlay = () => {
    if (iframeRef.current) {
      const func = isPlaying ? "pauseVideo" : "playVideo";
      iframeRef.current.contentWindow.postMessage(`{"event":"command","func":"${func}","args":""}`, "*");
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative h-full w-full bg-transparent flex items-center justify-center snap-start snap-always scroll-m-0 overflow-hidden">
      <div className="relative h-full w-full max-w-[500px] sm:max-w-md bg-black md:rounded-xl md:shadow-[0_0_50px_rgba(249,115,22,0.15)] md:border md:border-white/10 overflow-hidden">
        
        {isActive ? (
          <div 
            className="absolute inset-0 z-0 cursor-pointer"
            onClick={togglePlay}
          >
            <iframe
              ref={iframeRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              src={`https://www.youtube.com/embed/${short.videoId}?autoplay=1&mute=${globalMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&playsinline=1&loop=1&playlist=${short.videoId}&enablejsapi=1&disablekb=1&iv_load_policy=3`}
              title={short.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <img 
            src={short.thumbnail} 
            alt={short.title} 
            className="absolute top-0 left-0 w-full h-full object-cover opacity-70"
          />
        )}

        {/* Top Solid Overlay to hide YouTube Title Bar */}
        <div className="absolute top-0 left-0 right-0 h-[72px] bg-black z-20 flex items-center justify-end px-4 pointer-events-auto">
          {/* Global Mute Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setGlobalMuted(!globalMuted);
            }}
            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            title="Toggle Mute Globally"
          >
            {globalMuted ? (
              <>
                <VolumeX size={18} /> <span className="hidden sm:inline">Unmute</span>
              </>
            ) : (
              <>
                <Volume2 size={18} /> <span className="hidden sm:inline">Mute</span>
              </>
            )}
          </button>
        </div>

        {/* Play Button Overlay (when paused manually) */}
        <AnimatePresence>
          {!isPlaying && isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <Play size={32} className="fill-white text-white ml-1" />
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
        <div className="absolute bottom-6 left-4 right-16 z-20 pointer-events-none border-l-[3px] border-orange-500 pl-3">
          <h3 className="text-white font-bold text-[15px] leading-tight drop-shadow-md">
            {short.title}
          </h3>
          {short.description && (
            <p className="text-white/80 text-sm mt-2 line-clamp-2 drop-shadow-md font-light leading-snug">
              {short.description}
            </p>
          )}
        </div>

        {/* Sidebar Controls */}
        <ShortSidebar
          short={short}
          onOpenComments={() => setIsCommentModalOpen(true)}
          onOpenShare={() => setIsShareModalOpen(true)}
        />
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
    </div>
  );
};

export default ShortPlayer;
