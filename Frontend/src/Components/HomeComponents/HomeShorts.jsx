import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import { PlayCircle, Sparkles, ChevronRight } from 'lucide-react';

const HomeShorts = () => {
  const [shorts, setShorts] = useState([]);

  useEffect(() => {
    API.get('/shorts?limit=5').then(res => {
      if (res.data.success) {
        setShorts(res.data.shorts);
      }
    }).catch(console.error);
  }, []);

  if (shorts.length === 0) return null;

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-24 mb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold tracking-[.25em] text-orange-400 uppercase">
            <Sparkles size={16} /> Stack Adda Shorts
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl uppercase text-white font-black">
            Bite-Sized Learning
          </h2>
        </div>
        <Link 
          to="/shorts"
          className="hidden md:flex items-center gap-2 rounded-full border border-orange-500/50 bg-orange-500/10 px-5 py-2.5 text-sm font-bold text-orange-400 transition-all hover:bg-orange-500 hover:text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
        >
          Watch All <ChevronRight size={18} />
        </Link>
      </div>

      {/* Horizontal Scrollable Row */}
      <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 pt-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {shorts.map((short) => (
          <Link 
            to="/shorts" 
            key={short._id}
            className="group relative flex-none w-[180px] h-[320px] sm:w-[220px] sm:h-[390px] md:w-[260px] md:h-[460px] snap-center sm:snap-start rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.2)] hover:-translate-y-2 cursor-pointer"
          >
            <img src={short.thumbnail} alt={short.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F11] via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity"></div>
            
            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-xl">
                <PlayCircle size={24} className="text-orange-400" />
              </div>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
              <h3 className="text-white font-bold text-sm sm:text-base leading-tight line-clamp-2 drop-shadow-md group-hover:text-orange-400 transition-colors">
                {short.title}
              </h3>
            </div>
          </Link>
        ))}

        {/* View More Card */}
        <Link 
          to="/shorts"
          className="group relative flex-none w-[180px] h-[320px] sm:w-[220px] sm:h-[390px] md:w-[260px] md:h-[460px] snap-center sm:snap-start rounded-[2rem] overflow-hidden bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-500 flex flex-col items-center justify-center hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.5)] group-hover:scale-110 transition-transform duration-300 mb-4">
            <ChevronRight size={32} className="text-white" />
          </div>
          <span className="font-black text-lg text-white tracking-widest uppercase">View All</span>
        </Link>
      </div>

      <div className="flex justify-center md:hidden mt-2">
        <Link 
          to="/shorts"
          className="flex items-center gap-2 rounded-full border border-orange-500/50 bg-orange-500/10 px-8 py-4 text-sm font-bold text-orange-400 transition-all active:scale-95 shadow-[0_0_20px_rgba(249,115,22,0.15)]"
        >
          Watch All Shorts <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default HomeShorts;
