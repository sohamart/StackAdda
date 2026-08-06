import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, Loader2, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import MobileShortsPromo from "./HomeComponents/MobileShortsPromo";

const AIAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      content: "Hello! I'm the Stack Adda AI Assistant. 👋 How can I help you learn and build today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleLinkClick = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const [placeholderText, setPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const placeholders = [
    "Ask me anything about Stack Adda...",
    "What courses do you offer?",
    "How can I learn MERN stack?",
    "Who are the founders of Stack Adda?",
    "Are there any coding shorts?"
  ];

  useEffect(() => {
    const currentText = placeholders[placeholderIndex];
    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setPlaceholderText((prev) => prev + currentText[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setPlaceholderText("");
        setCharIndex(0);
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, placeholderIndex]);

  const sendMessage = async (text) => {
    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await API.post("/ai/chat", {
        messages: [...messages, userMessage],
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: res.data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: "Sorry, I am facing some issues right now." },
        ]);
      }
    } catch (error) {
      console.error("AI Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Sorry, I am facing some issues right now. Make sure the API key is set." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const textToSend = input;
    setInput("");
    await sendMessage(textToSend);
  };

  const handleSuggestionClick = (question) => {
    if (!isOpen) setIsOpen(true);
    sendMessage(question);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Chat Window */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen
            ? "max-h-[500px] w-[350px] sm:w-[400px] opacity-100 mb-4 scale-100"
            : "max-h-0 w-0 opacity-0 mb-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-[500px] max-h-[80vh] w-full bg-[#0c0c0e] border border-white/10 shadow-[0_10px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500/20 to-orange-600/10 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-orange-500/20 text-orange-400 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Stack Adda AI</h3>
                <p className="text-[10px] text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 h-0 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" data-lenis-prevent="true">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === "user"
                      ? "bg-white/10 text-white"
                      : "bg-orange-500 text-white"
                  }`}
                >
                  {msg.role === "user" ? <User size={14} /> : <Bot size={16} />}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-white/10 text-white rounded-tr-sm"
                        : "bg-orange-500/10 border border-orange-500/20 text-white/90 rounded-tl-sm"
                    }`}
                  >
                    {/* Basic markdown parsing for bold text */}
                    {msg.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part)}
                  </div>
                  {idx === 0 && msg.role === "model" && (
                    <div className="w-full mt-1">
                      <MobileShortsPromo />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-white/90 rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div className="px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap" data-lenis-prevent="true">
            <button
              onClick={() => handleSuggestionClick("What is Stack Adda?")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500/20 to-orange-400/10 hover:from-orange-500/30 hover:to-orange-400/20 border border-orange-500/20 rounded-full text-xs text-orange-400 transition"
            >
              <Sparkles size={12} className="text-orange-400" /> What is Stack Adda?
            </button>
            <button
              onClick={() => handleSuggestionClick("How to buy a course?")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 rounded-full text-xs text-white/70 transition"
            >
              How to buy a course?
            </button>
            <button
              onClick={() => handleSuggestionClick("Do you have free tutorials?")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 rounded-full text-xs text-white/70 transition"
            >
              Do you have free tutorials?
            </button>
            <button
              onClick={() => handleSuggestionClick("Who are the founders?")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 rounded-full text-xs text-white/70 transition"
            >
              Who are the founders?
            </button>
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-white/5 bg-white/[0.02]"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholderText}
                className="w-full bg-[#131316] border border-white/10 text-white text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-orange-500/50 transition-colors placeholder:text-white/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 p-1.5 bg-orange-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-orange-600 transition"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-full shadow-[0_10px_40px_rgba(249,115,22,0.4)] hover:shadow-[0_10px_50px_rgba(249,115,22,0.6)] hover:-translate-y-1 transition-all duration-300"
      >
        <Sparkles size={16} className="absolute top-0 right-0 text-white animate-pulse" />
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Bot size={28} className="text-white" />
        )}
      </button>
    </div>
  );
};

export default AIAvatar;
