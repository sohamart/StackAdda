import React, { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, RefreshCw } from "lucide-react";
import API from "../../api/axios";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

const ShortSidebar = ({
  short,
  onOpenComments,
  onOpenShare,
  onOpenLikes,
  onRefreshFeed,
}) => {
  const { user } = useAuth();
  
  const [isLiked, setIsLiked] = useState(user ? short.likes?.includes(user._id || user.id) : false);
  const [likesCount, setLikesCount] = useState(short.likes?.length || 0);
  
  const [isSaved, setIsSaved] = useState(user ? short.savedBy?.includes(user._id || user.id) : false);
  
  const [commentsCount, setCommentsCount] = useState(0); // Optional: if you pass comments count from API

  const navigate = useNavigate();

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like");
      navigate("/login");
      return;
    }
    // Optimistic UI update
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      await API.post(`/shorts/${short._id}/like`);
    } catch (error) {
      // Revert if error
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount + 1 : likesCount - 1);
      toast.error("Failed to like");
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Please login to save");
      navigate("/login");
      return;
    }
    setIsSaved(!isSaved);

    try {
      await API.post(`/shorts/${short._id}/save`);
      if (!isSaved) toast.success("Saved to your collection");
    } catch (error) {
      setIsSaved(!isSaved);
      toast.error("Failed to save");
    }
  };

  const iconClass = "flex items-center justify-center h-12 w-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl text-white transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:border-orange-500/50";

  return (
    <div className="absolute bottom-8 right-4 flex flex-col items-center gap-7 z-20 pb-4">
      {/* Refresh Global Feed (Only for global) */}
      {short.type === 'global' && onRefreshFeed && (
        <div className="flex flex-col items-center gap-1 mb-2">
          <button onClick={onRefreshFeed} className={iconClass}>
            <RefreshCw size={26} className="text-white drop-shadow-lg" />
          </button>
          <span className="text-xs font-semibold text-white drop-shadow-md">
            New
          </span>
        </div>
      )}

      {/* Like */}
      <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={onOpenLikes}>
        <button onClick={(e) => { e.stopPropagation(); handleLike(); }} className={`${iconClass} ${isLiked ? 'text-red-500' : ''}`}>
          <Heart size={26} className={isLiked ? "fill-red-500" : ""} />
        </button>
        <span className="text-xs font-semibold text-white drop-shadow-md">
          {formatNumber(likesCount)}
        </span>
      </div>

      {/* Comment */}
      <div className="flex flex-col items-center gap-1">
        <button onClick={() => {
          if (!user) {
            toast.error("Please login to comment");
            navigate("/login");
            return;
          }
          onOpenComments();
        }} className={iconClass}>
          <MessageCircle size={26} className="fill-white/20" />
        </button>
        <span className="text-xs font-semibold text-white drop-shadow-md">
          {formatNumber(short.commentsCount || 0)}
        </span>
      </div>

      {/* Share */}
      {short.type !== 'global' && (
        <div className="flex flex-col items-center gap-1">
          <button onClick={onOpenShare} className={iconClass}>
            <Share2 size={26} className="fill-white/20" />
          </button>
          <span className="text-xs font-semibold text-white drop-shadow-md">
            Share
          </span>
        </div>
      )}

      {/* Save */}
      {short.type !== 'global' && (
        <div className="flex flex-col items-center gap-1">
          <button onClick={handleSave} className={`${iconClass} ${isSaved ? 'text-orange-500' : ''}`}>
            <Bookmark size={26} className={isSaved ? "fill-orange-500" : ""} />
          </button>
          <span className="text-xs font-semibold text-white drop-shadow-md">
            Save
          </span>
        </div>
      )}

      {/* Profile Pic of Creator */}
      {short.creator && (
        <div className="mt-2 flex flex-col items-center gap-1 group cursor-pointer">
          <div className="relative h-12 w-12 rounded-full border-2 border-orange-500 p-[2px] overflow-hidden transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <img 
              src={short.creator.profileImage?.url || `https://ui-avatars.com/api/?name=${short.creator.name}&background=f97316&color=fff`} 
              alt={short.creator.name}
              className="h-full w-full rounded-full object-cover" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortSidebar;
