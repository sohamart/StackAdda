import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Globe, MessageCircle, Send } from "lucide-react";
import toast from "react-hot-toast";

const ShareModal = ({ isOpen, onClose, shortId }) => {
  const shareUrl = `${window.location.origin}/shorts/${shortId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: <Copy size={24} />,
      color: "bg-gray-600",
      action: copyToClipboard,
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle size={24} />,
      color: "bg-green-500",
      action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`, "_blank"),
    },
    {
      name: "Facebook",
      icon: <Globe size={24} />,
      color: "bg-blue-600",
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank"),
    },
    {
      name: "Telegram",
      icon: <Send size={24} />,
      color: "bg-blue-400",
      action: () => window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`, "_blank"),
    },
  ];

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
            className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-3xl bg-[#1a1a1a] p-6 shadow-[0_-10px_50px_rgba(0,0,0,0.5)] md:left-1/2 md:-translate-x-1/2 md:w-[400px] md:bottom-1/2 md:translate-y-1/2 md:rounded-3xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Share to</h2>
              <button onClick={onClose} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {shareOptions.map((option) => (
                <div key={option.name} className="flex flex-col items-center gap-2">
                  <button
                    onClick={option.action}
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition hover:scale-110 ${option.color}`}
                  >
                    {option.icon}
                  </button>
                  <span className="text-xs text-white/70">{option.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center rounded-xl bg-white/5 p-2 border border-white/10">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-transparent px-2 text-sm text-white/70 outline-none"
              />
              <button
                onClick={copyToClipboard}
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500"
              >
                Copy
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
