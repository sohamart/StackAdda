import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Trash2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import toast from "react-hot-toast";

const CommentModal = ({ isOpen, onClose, shortId, onCommentCountChange }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isOpen && shortId) {
      fetchComments();
    }
  }, [isOpen, shortId]);

  const fetchComments = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/shorts/${shortId}/comments`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setFetching(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      toast.error("Please login to comment");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/shorts/${shortId}/comment`,
        { text: newComment },
        { withCredentials: true }
      );
      if (res.data.success) {
        setComments([res.data.comment, ...comments]);
        setNewComment("");
        if (onCommentCountChange) onCommentCountChange(comments.length + 1);
        toast.success("Comment added");
      }
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/shorts/comment/${commentId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setComments(comments.filter((c) => c._id !== commentId));
        if (onCommentCountChange) onCommentCountChange(comments.length - 1);
        toast.success("Comment deleted");
      }
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error(error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 flex h-[70vh] flex-col rounded-t-3xl bg-[#0c0c0c] border-t border-white/10 shadow-[0_-10px_50px_rgba(0,0,0,0.5)] md:left-1/2 md:-translate-x-1/2 md:w-[400px] md:h-[600px] md:bottom-1/2 md:translate-y-1/2 md:rounded-3xl md:border"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <h2 className="text-lg font-bold text-white">Comments ({comments.length})</h2>
              <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition">
                <X size={20} />
              </button>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {fetching ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                </div>
              ) : comments.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-white/50">
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <img
                      src={comment.userId?.profileImage?.url || `https://ui-avatars.com/api/?name=${comment.userId?.name}&background=f97316&color=fff`}
                      alt={comment.userId?.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-white/80">@{comment.userId?.name || "User"}</span>
                        <span className="text-xs text-white/40">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-white mt-1">{comment.text}</p>
                    </div>
                    {(user?.role === "admin" || user?.id === comment.userId?._id) && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-white/40 hover:text-red-500 transition self-start"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 p-4 bg-[#0c0c0c]/80 backdrop-blur-md">
              <form onSubmit={handleAddComment} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={user ? "Add a comment..." : "Login to comment..."}
                  disabled={!user || loading}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || loading || !user}
                  className="rounded-full bg-orange-600 p-2 text-white hover:bg-orange-500 disabled:opacity-50 transition"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommentModal;
