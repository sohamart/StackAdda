import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Play } from "lucide-react";
import ShortSidebar from "./ShortSidebar";
import CommentModal from "./CommentModal";
import ShareModal from "./ShareModal";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ShortPlayer = ({ short, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef(null);

  // Sync play state with scroll visibility
  useEffect(() => {
    setIsPlaying(isActive);
    if (isActive) {
      // Record view when it becomes active
      axios.post(`http://localhost:5000/api/shorts/${short._id}/view`).catch(console.error);
    }
  }, [isActive, short._id]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state) => {
    setProgress(state.played * 100);
  };

  return (
    <div className="relative h-full w-full bg-black flex items-center justify-center snap-start snap-always scroll-m-0 overflow-hidden">
      {/* Video Player */}
      <div className="relative h-full w-full max-w-[500px] sm:max-w-md bg-[#0F0F11]">
        <div className="absolute inset-0 z-0" onClick={togglePlay}>
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${short.videoId}`}
            playing={isPlaying}
            loop={true}
            muted={false} // May require user interaction first, browsers block unmuted autoplay often
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            config={{
              youtube: {
                playerVars: {
                  controls: 0,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                  iv_load_policy: 3,
                  playsinline: 1, // Crucial for iOS shorts style
                },
              },
            }}
            onProgress={handleProgress}
          />
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
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-md">
                <Play size={32} className="fill-white text-white ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dark Gradient Overlay for text visibility */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10"></div>

        {/* Progress Bar (Instagram Style at bottom) */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
          <div
            className="h-full bg-orange-500 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Video Info (Bottom Left) */}
        <div className="absolute bottom-6 left-4 right-16 z-20">
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
