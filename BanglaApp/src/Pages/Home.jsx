import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      {/* Transparent Navbar */}
      <nav className="w-full h-16 md:h-20 border-b border-white/10 flex items-center justify-between px-4 md:px-12 bg-black/50 backdrop-blur-xl fixed top-0 z-50">
        <div className="text-xl md:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
          Stack Adda
        </div>
        <div className="hidden md:flex gap-8 font-semibold text-sm text-white/60">
          <a href="#" className="hover:text-white transition">Home</a>
          <a href="#" className="hover:text-white transition">Courses</a>
          <a href="#" className="hover:text-white transition">About Us</a>
          <a href="#" className="hover:text-white transition">Contact</a>
        </div>
        <button className="px-4 py-2 md:px-6 md:py-2.5 bg-white/10  hover:bg-white/20 rounded-full text-xs md:text-sm font-bold transition">
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 md:pt-40 pb-20 md:pb-24 px-4 md:px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glow behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[800px] h-[300px] md:h-[500px] bg-orange-600/15 md:bg-orange-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          New Platform
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 md:mb-8 leading-[1.1] md:leading-[1.1] tracking-tight relative z-10">
          Master Programming <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 drop-shadow-sm">
            in Bangla
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mb-10 md:mb-12 relative z-10 leading-relaxed font-medium px-2">
          Web Development, App Development, ebong Software Engineering sikhun ekdom nijer bhashay. Practical project er sathe shuru korun apnar tech career.
        </p>
        
        <div className="flex gap-4 relative z-10">
          <button className="px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 rounded-full font-bold text-base md:text-lg transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-105 active:scale-95">
            Explore Courses
          </button>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="px-4 md:px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pb-24 md:pb-32 relative z-10">
        {[
          { title: "100% In Bangla", desc: "Sob course ebong material apnar matribhashay." },
          { title: "Live Classes", desc: "Instructor er sathe directly connect hoye sikhun." },
          { title: "Practical Projects", desc: "Real-life project baniye portfolio heavy korun." }
        ].map((feature, i) => (
          <div key={i} className="h-auto min-h-[16rem] md:h-64 bg-white/[0.02] border border-white/5 rounded-[1.5rem] md:rounded-[2rem] flex flex-col justify-end p-6 md:p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-orange-500/20 mb-6 md:mb-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-4 h-4 md:w-6 md:h-6 bg-orange-500 rounded-full blur-[2px]" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{feature.title}</h3>
            <p className="text-white/50 text-sm md:text-sm font-medium leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
