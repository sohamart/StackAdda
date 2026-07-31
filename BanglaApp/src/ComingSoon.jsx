import React from 'react';

export default function ComingSoon() {
  return (
    <div className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-4 overflow-hidden font-sans">
      {/* Background Animated Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[800px] md:h-[800px] bg-orange-600/5 md:bg-orange-600/10 blur-[80px] md:blur-[150px] rounded-full animate-[pulse_5s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[150px] h-[150px] md:w-[500px] md:h-[500px] bg-red-600/5 md:bg-red-600/10 blur-[60px] md:blur-[120px] rounded-full pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 text-center flex flex-col items-center w-full max-w-4xl mx-auto mt-[-5vh]">
        
        {/* Professional Logo Area */}
        <div className="mb-8 md:mb-12 relative group">
          <div className="absolute inset-0 bg-orange-500 blur-2xl md:blur-3xl opacity-15 md:opacity-30 animate-pulse rounded-full transition-opacity group-hover:opacity-50" />
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white/[0.02] backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex items-center justify-center relative z-10 border border-white/10 p-4 md:p-5 transform group-hover:scale-105 transition-all duration-500 group-hover:border-white/20">
            <img 
              src="/logo.png" 
              alt="Stack Adda" 
              className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
            />
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 md:mb-6 tracking-tight leading-[1.1]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">Stack Adda</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-600 mt-1 md:mt-2">Bangla</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-white/50 mb-10 md:mb-14 max-w-2xl font-medium leading-relaxed px-4">
          Amader notun Bangla platform er kaj khub druto egiye cholche. Programming sikhun sompurno Banglay, khub shighroi asche!
        </p>

        {/* Modern Notification Badge */}
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-white/[0.03] border border-white/10 flex items-center gap-3 md:gap-4 backdrop-blur-md shadow-[0_0_40px_rgba(249,115,22,0.05)] hover:bg-white/[0.05] transition-colors cursor-default mx-4">
            <span className="relative flex h-2 w-2 md:h-3 md:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-orange-500"></span>
            </span>
            <span className="text-xs md:text-sm font-bold tracking-[0.1em] md:tracking-[0.2em] text-white/90 uppercase text-center">We are launching soon</span>
          </div>
        </div>

      </div>

      {/* Minimal Footer */}
      <div className="absolute bottom-6 md:bottom-8 text-white/30 text-[10px] md:text-sm font-medium tracking-wider md:tracking-widest text-center w-full px-4">
        © {new Date().getFullYear()} STACK ADDA. ALL RIGHTS RESERVED.
      </div>
    </div>
  );
}
