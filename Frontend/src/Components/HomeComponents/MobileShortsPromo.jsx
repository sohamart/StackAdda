import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../../api/axios';
import { PlayCircle, Sparkles, X } from 'lucide-react';

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
    <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] flex flex-col items-end animate-[bounce_4s_infinite]">
      {/* Close Button */}
      <button 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsVisible(false);
        }}
        className="absolute -top-3 -right-3 z-50 w-8 h-8 bg-[#1a1a1a] border border-white/20 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-red-500 transition-colors shadow-lg cursor-pointer"
        title="Hide"
      >
        <X size={16} />
      </button>

      {/* Floating Mockup */}
      <Link to="/shorts" className="relative group cursor-pointer block transform transition-all duration-700 hover:scale-105">
        
        {/* Pulsing glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] aspect-square rounded-full bg-orange-500/20 blur-2xl animate-pulse -z-10"></div>

        {/* Phone Frame */}
        <div className="relative w-[110px] h-[220px] md:w-[140px] md:h-[280px] rounded-[1.5rem] border-[5px] border-[#1a1a1a] bg-black shadow-2xl overflow-hidden shadow-[10px_10px_30px_rgba(0,0,0,0.8),_0_0_0_1px_rgba(255,255,255,0.1)_inset]">
          
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-3 bg-[#1a1a1a] rounded-b-lg z-30 flex items-center justify-center gap-1 shadow-inner">
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
          </div>

          {/* Screen */}
          <div className="absolute inset-0 bg-[#0a0a0a] overflow-hidden">
            {shorts.length > 0 ? (
              <div className="flex flex-col animate-[scrollUp_8s_linear_infinite] group-hover:[animation-play-state:paused]">
                {/* Duplicate the array to make the infinite scroll seamless */}
                {[...shorts, ...shorts].map((short, i) => (
                  <div key={i} className="w-full h-[210px] md:h-[270px] shrink-0 relative bg-black border-b border-white/10">
                    <img src={short.thumbnail} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                        <PlayCircle size={24} className="text-white drop-shadow-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a]">
                <Sparkles className="text-orange-500 animate-pulse" size={24} />
              </div>
            )}
          </div>
          
          {/* Glare */}
          <div className="absolute top-0 right-0 w-[150%] h-[150%] bg-gradient-to-bl from-white/20 to-transparent transform -translate-y-1/2 translate-x-1/4 rotate-12 pointer-events-none z-20 mix-blend-overlay"></div>
        </div>

        {/* Check Now Badge */}
        <div className="absolute -bottom-4 -left-8 md:-left-12 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black px-4 py-2.5 rounded-2xl rounded-br-sm shadow-[0_10px_20px_rgba(249,115,22,0.4)] rotate-[-12deg] z-40 border-[3px] border-[#0F0F11] tracking-widest uppercase text-[10px] md:text-xs">
          Check Now!
        </div>
      </Link>
    </div>
  );
};

export default MobileShortsPromo;
