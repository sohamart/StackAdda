import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Loader2 } from "lucide-react";
import API from "../../api/axios";

const LikesModal = ({ isOpen, onClose, shortId }) => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && shortId) {
      fetchLikes();
    }
  }, [isOpen, shortId]);

  const fetchLikes = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/shorts/${shortId}/likes`);
      if (res.data.success) {
        setLikes(res.data.likes);
      }
    } catch (error) {
      console.error("Failed to fetch likes", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex h-[70vh] flex-col rounded-t-3xl bg-[#1a1a1a] shadow-[0_-10px_50px_rgba(0,0,0,0.5)] md:left-1/2 md:-translate-x-1/2 md:w-[450px] md:bottom-1/2 md:translate-y-1/2 md:h-[600px] md:rounded-3xl border border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Heart size={20} className="fill-red-500 text-red-500" /> 
                {likes.length} Likes
              </h2>
              <button
                onClick={onClose}
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Likes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-orange-500">
              {loading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="animate-spin text-orange-500" size={32} />
                </div>
              ) : likes.length === 0 ? (
                <p className="text-center text-white/50 py-8">No likes yet. Be the first!</p>
              ) : (
                likes.map((user) => (
                  <div key={user._id} className="flex items-center gap-3">
                    <img
                      src={user.profileImage?.url || `https://ui-avatars.com/api/?name=${user.name}&background=f97316&color=fff`}
                      alt={user.name}
                      className="h-10 w-10 rounded-full object-cover border border-orange-500/30"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-white">{user.name}</h4>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LikesModal;
