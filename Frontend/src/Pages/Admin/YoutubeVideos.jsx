import { useEffect, useState, useCallback } from "react";
import { Search, PlayCircle, RefreshCw, Eye, EyeOff, Loader2, Play } from "lucide-react";
import { toast } from "react-toastify";
import API from "../../api/axios";

export default function YoutubeVideos() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/youtube/admin/videos");
      if (data.success) {
        setVideos(data.videos || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load YouTube videos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleSync = async () => {
    try {
      setSyncing(true);
      // Backend automatically syncs when we fetch admin videos,
      // but let's re-fetch to update state
      await fetchVideos();
      toast.success("Successfully synchronized latest YouTube uploads!");
    } catch (error) {
      toast.error("Failed to sync videos.");
    } finally {
      setSyncing(false);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const { data } = await API.put(`/youtube/admin/videos/${id}/toggle`);
      if (data.success) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === id || v.videoId === id
              ? { ...v, isPublished: data.video.isPublished }
              : v
          )
        );
        toast.success(
          `Video visibility updated: now ${
            data.video.isPublished ? "Visible" : "Hidden"
          } on site.`
        );
      }
    } catch (error) {
      toast.error("Failed to update video status.");
    }
  };

  const filtered = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase()) ||
    (video.description && video.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-10 text-white">
      {/* Header Section */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <PlayCircle size={38} className="text-red-500" /> YouTube Playlist Manager
          </h1>
          <p className="mt-2 text-white/50">
            Sync and toggle visibility of YouTube uploads on the public pages.
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing || loading}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-orange-600 hover:bg-orange-500 px-5 py-3 font-semibold text-white transition active:scale-95 disabled:opacity-50 shadow-[0_4px_20px_rgba(249,115,22,0.25)] cursor-pointer"
        >
          {syncing ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <RefreshCw size={18} />
          )}
          Sync Uploads
        </button>
      </div>

      {/* Stats and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search synced uploads..."
            className="w-full rounded-2xl border border-white/15 bg-black/40 py-3.5 pl-11 pr-4 text-white outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex gap-4 text-sm text-white/55">
          <div>
            Total: <span className="font-bold text-white">{videos.length}</span>
          </div>
          <div>
            Published:{" "}
            <span className="font-bold text-green-400">
              {videos.filter((v) => v.isPublished).length}
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex h-[50vh] items-center justify-center">
          <Loader2 className="animate-spin text-orange-500" size={48} />
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video) => {
            const formattedDate = video.publishedAt
              ? new Date(video.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Unknown Date";

            return (
              <article
                key={video._id || video.videoId}
                className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-300 flex flex-col ${
                  video.isPublished
                    ? "border-white/10 bg-white/[0.04] hover:border-orange-500/50"
                    : "border-white/5 bg-white/[0.01] opacity-75 hover:opacity-100 hover:border-red-500/30"
                }`}
              >
                {/* Image / Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      video.thumbnailUrl ||
                      `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
                    }
                    alt={video.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Play Button Overlay */}
                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity"
                  >
                    <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg">
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    </div>
                  </a>

                  {/* Visibility status indicator */}
                  <span
                    className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-xl shadow-lg border ${
                      video.isPublished
                        ? "bg-green-500/20 text-green-400 border-green-500/25"
                        : "bg-red-500/20 text-red-400 border-red-500/25"
                    }`}
                  >
                    {video.isPublished ? "Showing" : "Hidden"}
                  </span>

                  <span className="absolute bottom-4 right-4 rounded bg-black/75 px-2 py-0.5 text-xs text-white">
                    {video.duration || "15:00"}
                  </span>
                </div>

                {/* Info Content */}
                <div className="p-6 flex flex-1 flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-orange-400 uppercase tracking-widest">
                      {formattedDate}
                    </span>
                    <h3 className="mt-2 text-xl font-bold leading-tight line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/50 line-clamp-2 leading-relaxed">
                      {video.description || "No description provided."}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
                    <span className="text-xs text-white/40">
                      ID: {video.videoId}
                    </span>

                    <button
                      onClick={() =>
                        handleTogglePublish(video._id || video.videoId)
                      }
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition duration-300 cursor-pointer ${
                        video.isPublished
                          ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                          : "bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20"
                      }`}
                    >
                      {video.isPublished ? (
                        <>
                          <EyeOff size={14} /> Hide on Site
                        </>
                      ) : (
                        <>
                          <Eye size={14} /> Show on Site
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!filtered.length && !loading && (
        <div className="rounded-[2rem] border border-dashed border-white/15 p-16 text-center text-white/50">
          No YouTube video uploads match your criteria.
        </div>
      )}
    </div>
  );
}
