import React, { useEffect, useState } from "react";
import { Tv, ExternalLink, Users, PlayCircle, Star, Loader2, Clock } from "lucide-react";
import API from "../api/axios";

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/channels")
      .then(({ data }) => {
        if (data.success) {
          // Sort to show featured first, then published, then coming soon
          const sorted = data.channels.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            if (a.status === "Published" && b.status !== "Published") return -1;
            if (a.status !== "Published" && b.status === "Published") return 1;
            return 0;
          });
          setChannels(sorted);
        }
      })
      .catch((err) => console.error("Failed to load channels", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#09090B] px-4 sm:px-6 md:px-10 pt-24 md:pt-32 pb-20 md:pb-24 text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[500px] rounded-full bg-orange-500/10 blur-[150px] pointer-events-none" />
      
      <section className="relative w-full">
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[.25em] text-orange-400 uppercase">
            Stack Adda Network
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent">
            Our YouTube Channels.
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-base leading-8 text-white/50">
            Explore different nodes of the Stack Adda network. Choose a track, follow the updates, and elevate your development journey with customized video broadcasts.
          </p>
        </div>

        {loading ? (
          <div className="mt-20 flex justify-center">
            <Loader2 className="animate-spin text-orange-500" size={48} />
          </div>
        ) : (
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {channels.map((ch) => (
              <article
                key={ch._id}
                className={`group relative rounded-[2rem] border p-8 backdrop-blur-2xl transition duration-500 flex flex-col justify-between ${
                  ch.status === "Published" ? "hover:-translate-y-2" : ""
                } ${
                  ch.featured
                    ? "border-orange-500/30 bg-gradient-to-br from-orange-500/10 via-white/[0.02] to-black"
                    : ch.status === "Published"
                    ? "border-white/10 bg-white/[0.03] hover:border-orange-500/30"
                    : "border-white/5 bg-white/[0.01] opacity-70"
                }`}
              >
                {ch.featured && (
                  <div className="absolute -top-3.5 right-6 flex items-center gap-1 rounded-full bg-orange-500 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-lg shadow-orange-500/20">
                    <Star size={10} fill="currentColor" /> Main Channel
                  </div>
                )}
                
                {ch.status === "Coming Soon" && !ch.featured && (
                  <div className="absolute -top-3.5 right-6 flex items-center gap-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest backdrop-blur-xl">
                    <Clock size={10} /> Coming Soon
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-5">
                    <img
                      src={ch.avatar}
                      alt=""
                      className={`h-16 w-16 rounded-2xl border border-white/10 object-cover ${ch.status === "Coming Soon" ? "grayscale opacity-50" : ""}`}
                    />
                    <div>
                      <h2 className={`text-xl font-bold transition-colors duration-300 ${ch.status === "Published" ? "group-hover:text-orange-400" : "text-white/60"}`}>
                        {ch.name}
                      </h2>
                      <div className="mt-1.5 flex gap-4 text-xs font-semibold text-white/40">
                        <span className="flex items-center gap-1.5">
                          <Users size={13} className={ch.status === "Published" ? "text-orange-400" : ""} />
                          {ch.subscribers} Subscribers
                        </span>
                        <span className="flex items-center gap-1.5">
                          <PlayCircle size={13} className={ch.status === "Published" ? "text-orange-400" : ""} />
                          {ch.videos} Videos
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-6 text-sm leading-7 text-white/60">
                    {ch.description}
                  </p>
                </div>

                <div className="mt-8">
                  {ch.status === "Published" ? (
                    <a
                      href={ch.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 px-5 font-bold text-white transition-all duration-300 hover:bg-orange-600 group-hover:shadow-lg group-hover:shadow-orange-500/15 text-sm"
                    >
                      <Tv size={18} />
                      Subscribe on YouTube
                      <ExternalLink size={14} className="opacity-60" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3.5 px-5 font-bold text-white/30 text-sm cursor-not-allowed"
                    >
                      <Clock size={18} />
                      Channel Coming Soon
                    </button>
                  )}
                </div>
              </article>
            ))}
            
            {channels.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center text-white/40 border border-dashed border-white/10 rounded-[2rem]">
                No channels found in the directory.
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
