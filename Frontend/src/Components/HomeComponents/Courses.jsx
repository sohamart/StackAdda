import { useEffect, useState } from "react";
import { ArrowUpRight, Play, Clock3, Loader2, Star, PlayCircle } from "lucide-react";
import API from "../../api/axios";

export default function Courses() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/youtube")
      .then(({ data }) => setVideos(data.videos || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={42} />
      </div>
    );
  }

  const handleWatch = (link) => {
    window.open(link, "_blank");
  };

  return (
    <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
      {videos.map((video, index) => {
        return (
          <article
            key={video.videoId || index}
            className="group relative flex min-h-[510px] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[.085] to-white/[.025] shadow-[0_25px_70px_rgba(0,0,0,.3)] transition duration-500 hover:-translate-y-3 hover:border-orange-500/55 hover:shadow-[0_25px_80px_rgba(249,115,22,.16)]"
          >
            {/* Orange Glow */}
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-orange-500/15 blur-[70px] transition group-hover:bg-orange-500/30" />

            {/* Thumbnail */}
            <div className="relative h-60 overflow-hidden cursor-pointer" onClick={() => handleWatch(video.link)}>
              <img
                src={video.thumbnailUrl || "https://placehold.co/1000x600/18181b/f97316?text=Stack+Adda"}
                alt={video.title}
                className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100f] via-transparent to-transparent" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                <div className="h-16 w-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <Play size={28} fill="currentColor" className="ml-1" />
                </div>
              </div>

              {/* Badges */}
              <div className="absolute left-4 top-4 flex gap-2">
                <span className="rounded-full border border-orange-300/25 bg-orange-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-100 backdrop-blur-xl">
                  {index === 0 ? "Featured" : "Tutorial"}
                </span>
                <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-xl">
                  Free
                </span>
              </div>

              {/* Rating */}
              <div className="absolute bottom-4 left-4 flex items-center gap-1 rounded-full bg-black/45 px-3 py-1.5 text-sm text-orange-200 backdrop-blur">
                <Star size={14} fill="currentColor" />
                <span>4.9</span>
                <span className="ml-1 text-white/55">(YouTube)</span>
              </div>
            </div>

            {/* Content */}
            <div className="relative flex flex-1 flex-col p-6">
              <p className="text-xs font-semibold tracking-[.16em] text-orange-400">STACK ADDA</p>
              
              <h2 className="mt-3 line-clamp-2 text-2xl font-black leading-tight text-white group-hover:text-orange-400 transition-colors">
                <a href={video.link} target="_blank" rel="noreferrer">
                  {video.title}
                </a>
              </h2>
              
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/55">
                {video.description || "Learn Full Stack development with our curated video tutorials."}
              </p>

              {/* Key Details */}
              <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/15 p-3 text-center text-xs text-white/60">
                <span className="flex flex-col items-center gap-1">
                  <PlayCircle size={15} className="text-red-500" />
                  YouTube
                </span>
                <span className="flex flex-col items-center gap-1">
                  <Clock3 size={15} className="text-orange-400" />
                  {video.duration || "15:00"}
                </span>
                <span className="flex flex-col items-center gap-1">
                  <Star size={15} className="text-orange-400" />
                  High Quality
                </span>
              </div>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between pt-6">
                <div>
                  <p className="text-xs text-white/40">Watch for free</p>
                  <p className="mt-1 text-2xl font-black text-orange-300">Free</p>
                </div>
                <button
                  onClick={() => handleWatch(video.link)}
                  className="inline-flex items-center gap-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700"
                >
                  Watch Now <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </article>
        );
      })}

      {!videos.length && (
        <div className="col-span-full rounded-3xl border border-dashed border-white/15 p-16 text-center text-white/50">
          YouTube videos will appear here soon.
        </div>
      )}
    </div>
  );
}
