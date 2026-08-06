import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, Loader2, Sparkles, Languages } from "lucide-react";

const AIAvatar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      content: "নমস্কার! আমি Stack Adda Bangla-র AI অ্যাসিস্ট্যান্ট। কীভাবে আপনাকে সাহায্য করতে পারি? 👋",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const [placeholderText, setPlaceholderText] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const placeholders = [
    "কবে লঞ্চ হবে?",
    "কী কী কোর্স থাকবে?",
    "লাইভ ক্লাস হবে কি?",
    "Stack Adda Bangla কী?",
    "ফ্রি কোর্স থাকবে কি?"
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
      // Pointing to the main backend API on port 5000
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: "bangla" // Specific context for Bangla App
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", content: "দুঃখিত, কোনো সমস্যা হয়েছে।" },
        ]);
      }
    } catch (error) {
      console.error("AI Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "দুঃখিত, সার্ভারের সাথে যোগাযোগ করতে পারছি না।" },
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
        <div className="flex flex-col h-[500px] max-h-[80vh] w-full bg-[#0c0c0e] border border-green-500/10 shadow-[0_10px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600/20 to-emerald-600/10 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-500/20 text-green-400 rounded-lg">
                <Languages size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Stack Adda Bangla AI</h3>
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
          <div className="flex-1 h-0 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
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
                      : "bg-green-600 text-white"
                  }`}
                >
                  {msg.role === "user" ? <User size={14} /> : <Bot size={16} />}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-white/10 text-white rounded-tr-sm"
                        : "bg-green-500/10 border border-green-500/20 text-white/90 rounded-tl-sm"
                    }`}
                  >
                    {/* Basic markdown parsing for bold text */}
                    {msg.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part)}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="shrink-0 w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 text-white/90 rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div className="px-3 pb-2 flex gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
            <button
              onClick={() => handleSuggestionClick("Bangla platform কবে লঞ্চ হবে?")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-400/10 hover:from-green-500/30 hover:to-emerald-400/20 border border-green-500/20 rounded-full text-xs text-green-400 transition"
            >
              <Sparkles size={12} className="text-green-400" /> কবে লঞ্চ হবে?
            </button>
            <button
              onClick={() => handleSuggestionClick("কী কী কোর্স থাকবে?")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 rounded-full text-xs text-white/70 transition"
            >
              কী কী কোর্স থাকবে?
            </button>
            <button
              onClick={() => handleSuggestionClick("Live DSA ক্লাস হবে কি?")}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 rounded-full text-xs text-white/70 transition"
            >
              Live DSA ক্লাস হবে?
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
                className="w-full bg-[#131316] border border-white/10 text-white text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-green-500/50 transition-colors placeholder:text-white/30"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 p-1.5 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Avatar Button Area */}
      <div className="relative flex flex-col items-end group/btn">
        
        {/* Floating Tooltip */}
        {!isOpen && (
          <div className="absolute -top-12 right-0 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xl animate-bounce whitespace-nowrap pointer-events-none transition-opacity duration-300 opacity-80 group-hover/btn:opacity-100">
            Stack Adda Bangla ✨
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white/10 border-r border-b border-white/20 transform rotate-45"></div>
          </div>
        )}

        <div className="relative mt-2">
          {/* Pulsing Background Rings */}
          {!isOpen && (
            <>
              <div className="absolute inset-0 rounded-full bg-green-500 animate-[ping_2s_ease-in-out_infinite] opacity-40"></div>
              <div className="absolute -inset-2 rounded-full border border-green-500/30 animate-[spin_4s_linear_infinite]"></div>
              <div className="absolute -inset-3 rounded-full border border-green-500/10 animate-[spin_4s_linear_infinite_reverse]"></div>
            </>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-green-600 via-green-500 to-emerald-400 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:shadow-[0_0_50px_rgba(34,197,94,0.8)] hover:-translate-y-1 hover:scale-110 transition-all duration-300 z-10 overflow-hidden"
          >
            {/* Glass Glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1s_infinite]"></div>
            
            <Sparkles size={14} className="absolute top-2 right-2 text-white animate-pulse" />
            
            {isOpen ? (
              <X size={24} className="text-white drop-shadow-md" />
            ) : (
              <Languages size={28} className="text-white drop-shadow-lg transform transition-transform group-hover/btn:scale-110 group-hover/btn:rotate-12" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAvatar;
