import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Play, Clock3, Loader2, Star, PlayCircle } from "lucide-react";
import API from "../../api/axios";

export default function Courses() {
  const navigate = useNavigate();
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

  const handleWatch = (videoId) => {
    navigate(`/courses?v=${videoId}`);
  };

  return (
    <div className="mt-12 grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
      {videos.map((video, index) => {
        return (
          <article
            key={video.videoId}
            className="group flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.03] backdrop-blur-md transition duration-500 hover:-translate-y-3 hover:border-orange-500/40"
            style={{
              animation: `float ${5 + index}s ease-in-out infinite`,
            }}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={video.thumbnailUrl || "https://placehold.co/900x500/18181b/f97316?text=Stack+Adda"}
                alt={video.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12100f] via-transparent to-transparent" />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                <div className="h-14 w-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <Play size={24} fill="currentColor" className="ml-1" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-grow flex-col p-6">
              <h2 className="text-xl font-bold leading-tight line-clamp-2 min-h-[3rem] text-white group-hover:text-orange-400 transition-colors">
                <a
                  onClick={() => handleWatch(video.videoId)}
                  className="cursor-pointer"
                >
                  {video.title}
                </a>
              </h2>
              
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/55">
                {video.description || "Learn Full Stack development with our curated video tutorials."}
              </p>

              {/* Key Details */}
              <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/15 p-3 text-center text-[10px] sm:text-xs text-white/60">
                <span className="flex flex-col items-center gap-1 justify-center">
                  <PlayCircle size={15} className="text-red-500" />
                  {video.views >= 1000 ? (video.views / 1000).toFixed(1) + "K" : video.views} Views
                </span>
                <span className="flex flex-col items-center gap-1 justify-center border-x border-white/5">
                  <Clock3 size={15} className="text-orange-400" />
                  {video.duration || "15:00"}
                </span>
                <span className="flex flex-col items-center gap-1 justify-center">
                  <Star size={15} className="text-orange-400" fill="currentColor" />
                  {video.likes} Likes
                </span>
              </div>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between pt-6">
                <div>
                  <p className="text-xs text-white/40">Watch for free</p>
                  <p className="mt-1 text-2xl font-black text-orange-300">Free</p>
                </div>
                <button
                  onClick={() => handleWatch(video.videoId)}
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
