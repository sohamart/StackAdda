import React from "react";

const sponsors = [
  { name: "Google Cloud" },
  { name: "Vercel" },
  { name: "GitHub" },
  { name: "Amazon Web Services" },
  { name: "MongoDB" },
  { name: "Stripe" },
  { name: "Microsoft Azure" },
  { name: "Docker" }
];

export default function SponsorBanner() {
  return (
    <div className="w-full bg-transparent pt-10 pb-5 overflow-hidden relative select-none">
      {/* CSS Animation injected via style tag */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .sponsor-track {
          display: flex;
          width: max-content;
          animation: scroll 25s linear infinite;
        }
      `}</style>

      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-[800px] h-[100px] bg-orange-500/10 blur-3xl pointer-events-none rounded-[100%]" />

      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

      <p className="relative z-20 text-center text-[10px] font-black tracking-[0.4em] uppercase bg-gradient-to-r from-white/20 via-white/50 to-white/20 bg-clip-text text-transparent mb-7">
        Trusted by World-Class Platforms
      </p>

      <div className="relative w-full h-[60px] flex items-center justify-start overflow-visible">
        {/* Dimmed Track (Background) */}
        <div className="sponsor-track flex items-center gap-16 md:gap-24 absolute left-0 z-20">
          {[...sponsors, ...sponsors].map((sp, idx) => (
            <div
              key={`dim-${idx}`}
              className="flex items-center gap-3 text-lg md:text-2xl font-black text-white/20 tracking-wider cursor-default"
            >
              {/* Dimmed dot */}
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              {sp.name}
            </div>
          ))}
        </div>

        {/* Highlighted Track (Foreground, Masked to Center via Static Wrapper) */}
        <div 
          className="absolute inset-0 z-30 pointer-events-none"
          style={{
            WebkitMaskImage: 'radial-gradient(ellipse 20% 150% at 50% 50%, black 15%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 20% 150% at 50% 50%, black 15%, transparent 100%)'
          }}
        >
          <div className="sponsor-track flex items-center gap-16 md:gap-24 absolute left-0 h-full">
            {[...sponsors, ...sponsors].map((sp, idx) => (
              <div
                key={`high-${idx}`}
                className="flex items-center gap-3 text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-200 tracking-wider cursor-default"
              >
                {/* Glowing gradient indicator dot */}
                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-orange-400 to-red-600 shadow-[0_0_12px_rgba(249,115,22,0.8)] scale-125 transition-transform" />
                {sp.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
