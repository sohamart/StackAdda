import React, { useRef, useState, useEffect } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import ShortSidebar from "./ShortSidebar";
import CommentModal from "./CommentModal";
import ShareModal from "./ShareModal";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ShortPlayer = ({ short, isActive, globalMuted, setGlobalMuted }) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Record view when it becomes active
  useEffect(() => {
    if (isActive) {
      axios.post(`http://localhost:5000/api/shorts/${short._id}/view`).catch(console.error);
    }
  }, [isActive, short._id]);

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center snap-start snap-always scroll-m-0 overflow-hidden">
      {/* Video Player */}
      <div className="relative h-full w-full max-w-[500px] sm:max-w-md bg-[#0F0F11]">
        
        {isActive ? (
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${short.videoId}?autoplay=1&mute=${globalMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0&playsinline=1`}
            title={short.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
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
                <VolumeX size={18} /> <span>Unmute</span>
              </>
            ) : (
              <>
                <Volume2 size={18} /> <span>Mute</span>
              </>
            )}
          </button>
        </div>

        {/* Dark Gradient Overlay for text visibility */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none z-10"></div>

        <div className="absolute bottom-6 left-4 right-16 z-20 pointer-events-none">
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
