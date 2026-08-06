import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../../api/axios';
import { PlayCircle, Sparkles, X, ChevronRight } from 'lucide-react';

const MobileShortsPromo = () => {
  const [shorts, setShorts] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    API.get('/shorts?limit=3').then(res => {
      if (res.data.success) {
        setShorts(res.data.shorts);
      }
    }).catch(console.error);
  }, []);

  // Hide on shorts page itself
  if (location.pathname.includes('/shorts')) return null;
  if (!isVisible) return null;

  return (
    <div className="w-full mb-4 px-2">
      {/* Small Promo Card */}
      <Link 
        to="/shorts" 
        className="relative flex items-center w-full h-[85px] md:h-[100px] bg-gradient-to-r from-[#1a0f0a] to-[#2a1405] border border-orange-500/30 rounded-2xl shadow-[0_10px_40px_rgba(249,115,22,0.15)] group transition-all duration-500 hover:scale-[1.02] hover:border-orange-500/60"
      >
        {/* Ambient Glow behind card */}
        <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-2xl animate-pulse group-hover:bg-orange-500/20 transition-colors"></div>

        {/* Left Side: Text Content */}
        <div className="flex-1 pl-4 md:pl-5 relative z-10">
          <div className="flex items-center gap-1 text-orange-400 text-[9px] md:text-[10px] font-black tracking-widest uppercase mb-1 drop-shadow-md">
            <Sparkles size={10} className="animate-pulse" />
            New Feature
          </div>
          <h3 className="text-white font-black text-sm md:text-base leading-tight mb-0.5 drop-shadow-md">
            Watch Shorts
          </h3>
          <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            Check Now <ChevronRight size={12} className="text-red-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Right Side: Pop-out Mobile Device */}
        <div className="absolute right-3 bottom-0 w-[60px] md:w-[70px] h-[120px] md:h-[140px] transform origin-bottom z-20">
          
          {/* Phone Frame */}
          <div className="w-full h-full rounded-[0.8rem] border-[3px] border-[#1a1a1a] bg-black shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden relative group-hover:-translate-y-2 transition-transform duration-500">
            
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-1.5 bg-[#1a1a1a] rounded-b-md z-30 flex items-center justify-center">
               <div className="w-0.5 h-0.5 rounded-full bg-white/20"></div>
            </div>

            {/* Screen */}
            <div className="absolute inset-0 bg-black overflow-hidden">
              {shorts.length > 0 ? (
                <div className="flex flex-col animate-[scrollUp_8s_linear_infinite] group-hover:[animation-play-state:paused]">
                  {/* Duplicate array for seamless loop */}
                  {[...shorts, ...shorts].map((short, i) => (
                    <div key={i} className="w-full h-[114px] md:h-[134px] shrink-0 relative border-b border-white/10 bg-black">
                      <img src={short.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-80" alt="" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <PlayCircle size={16} className="text-white/80 drop-shadow-lg" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="text-orange-500 animate-pulse" size={14} />
                </div>
              )}
            </div>
            
            {/* Screen Glare */}
            <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-bl from-white/20 to-transparent transform -translate-y-1/2 translate-x-1/4 rotate-12 pointer-events-none z-20 mix-blend-overlay"></div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MobileShortsPromo;
