import { useEffect, useState } from "react";
import SEO from "../../Components/SEO";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Loader2,
  PlayCircle,
  FileText,
  ShieldAlert,
  Star,
  Play,
  Clock3,
  ThumbsUp,
  BookOpen,
} from "lucide-react";
import API from "../../api/axios";

const renderDescriptionWithLinks = (text) => {
  if (!text)
    return "Welcome to Stack Adda. Access standard full-stack guidelines and files under resource tabs.";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <span key={i} className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 align-middle mx-1">
          <a
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline truncate"
            title={part}
          >
            {part.length > 30 ? part.substring(0, 30) + "..." : part}
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(part);
              alert("Link Copied!");
            }}
            className="text-white/50 hover:text-white cursor-pointer transition-colors border-l border-white/10 pl-1 ml-1"
            title="Copy Link"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </span>
      );
    }
    return part;
  });
};

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const videoIdParam = searchParams.get("v");

  const [videos, setVideos] = useState([]);
  const [structuredCourses, setStructuredCourses] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("courses"); // "courses" | "videos" | "terms" | "privacy"
  const [stats, setStats] = useState({
    subscribers: "12K+",
    views: "1.2M+",
    videos: "150+",
    channelName: "Stack Adda"
  });

  useEffect(() => {
    // Fetch videos list
    API.get("/youtube")
      .then(({ data }) => {
        setVideos(data.videos || []);
      })
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));

    API.get("/course/all")
      .then(({ data }) => {
        setStructuredCourses(data.courses || []);
      })
      .catch((err) => console.error(err));

    // Fetch stats
    API.get("/youtube/stats")
      .then(({ data }) => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Update active video when videos list loads or search params change
  useEffect(() => {
    if (videos.length > 0) {
      if (videoIdParam) {
        const found = videos.find((v) => v.videoId === videoIdParam);
        if (found) {
          setActiveVideo(found);
          return;
        }
      }
      setActiveVideo(videos[0]);
    }
  }, [videos, videoIdParam]);

  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(search.toLowerCase()) ||
      (video.description &&
        video.description.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B]">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <>
    <SEO title="Courses & Tutorials" description="Explore Stack Adda's structured courses and YouTube tutorials." canonicalUrl="/courses" />
    <main className="min-h-screen overflow-hidden bg-[#09090B] px-5 pb-20 pt-32 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Banner Section */}
        <section className="relative overflow-hidden rounded-[2.25rem] border border-orange-500/20 bg-gradient-to-br from-orange-500/[.16] via-white/[.045] to-transparent p-7 md:p-12">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="text-sm font-semibold tracking-[.25em] text-orange-300">
              STACK ADDA RESOURCE HUB
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Learn, Build & Share.
            </h1>
            <p className="mt-5 max-w-2xl leading-8 text-white/65">
              Explore our free YouTube tutorials, review our platform guidelines, and access developer resources.
            </p>
            {stats && (
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  {stats.subscribers} Subscribers
                </span>
                <span className="text-white/35">•</span>
                <span>{stats.views} Views</span>
                <span className="text-white/35">•</span>
                <span>{stats.videos} Videos</span>
              </div>
            )}
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="mt-12 flex flex-wrap gap-3 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("courses")}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition duration-300 ${
              activeTab === "courses"
                ? "bg-orange-500 text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)]"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <BookOpen
              size={18}
              className={activeTab === "courses" ? "text-white" : "text-blue-500"}
            />
            Structured Courses
          </button>
          
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition duration-300 ${
              activeTab === "videos"
                ? "bg-orange-500 text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)]"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <PlayCircle
              size={18}
              className={activeTab === "videos" ? "text-white" : "text-red-500"}
            />
            YouTube Videos
          </button>

          <button
            onClick={() => setActiveTab("terms")}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition duration-300 ${
              activeTab === "terms"
                ? "bg-orange-500 text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)]"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FileText size={18} className="text-orange-400" />
            Terms & Conditions
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition duration-300 ${
              activeTab === "privacy"
                ? "bg-orange-500 text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)]"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <ShieldAlert size={18} className="text-orange-400" />
            Privacy Policy
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === "courses" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {structuredCourses.length === 0 ? (
                <div className="col-span-full rounded-3xl border border-dashed border-white/15 p-16 text-center text-white/50">
                  No courses available yet.
                </div>
              ) : (
                structuredCourses.map(course => (
                  <div key={course._id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/50 transition">
                    <img src={course.thumbnail?.url || "https://placehold.co/600x400/111/fff?text=No+Thumbnail"} className="w-full aspect-video object-cover" />
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                      <p className="text-sm text-white/60 line-clamp-2 mb-4">{course.description}</p>
                      <a href={`/course/${course.slug}`} className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-bold w-full text-center transition">
                        View Course
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "videos" && (
            <>
              {videos.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/15 p-16 text-center text-white/50">
                  YouTube videos will appear here soon.
                </div>
              ) : (
                /* Classroom Layout */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Side: Video Player Area */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Main YouTube Embed Frame */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 shadow-2xl">
                      {activeVideo ? (
                        <iframe
                          title={activeVideo.title}
                          src={`https://www.youtube.com/embed/${activeVideo.videoId}?rel=0&autoplay=0`}
                          className="absolute inset-0 h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-white/40">
                          Select a lesson from the syllabus to begin.
                        </div>
                      )}
                    </div>

                    {/* Active Video Info */}
                    {activeVideo && (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <h2 className="text-2xl font-black text-white leading-tight">
                            {activeVideo.title}
                          </h2>
                          <a
                            href="https://www.youtube.com/@stackadda?sub_confirmation=1"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-red-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-red-700 active:scale-95 self-start"
                          >
                            Subscribe
                          </a>
                        </div>

                        {/* Real-time stats indicators */}
                        <div className="flex flex-wrap items-center gap-6 text-xs text-white/60">
                          <span className="flex items-center gap-1.5">
                            <Play size={14} className="text-red-500 fill-red-500" />
                            <strong>{activeVideo.views >= 1000 ? (activeVideo.views / 1000).toFixed(1) + "K" : activeVideo.views}</strong> Views
                          </span>
                          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                          <span className="flex items-center gap-1.5">
                            <ThumbsUp size={14} className="text-orange-400" />
                            <strong>{activeVideo.likes}</strong> Likes
                          </span>
                          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                          <span className="flex items-center gap-1.5">
                            <Clock3 size={14} className="text-orange-400" />
                            Duration: <strong>{activeVideo.duration || "15:00"}</strong>
                          </span>
                        </div>

                        {/* Description Notes Card */}
                        <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 backdrop-blur-2xl">
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            Video Notes & Details
                          </h3>
                          <p className="mt-4 text-sm text-white/70 whitespace-pre-line leading-relaxed max-h-[300px] overflow-y-auto pr-2 no-scrollbar" data-lenis-prevent="true">
                            {renderDescriptionWithLinks(activeVideo.description)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Playlist Syllabus Sidebar */}
                  <div className="lg:col-span-4 space-y-4">
                    {/* Search Field */}
                    <div className="relative">
                      <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
                        size={18}
                      />
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search videos..."
                        className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-11 pr-4 text-sm text-white outline-none focus:border-orange-500 transition duration-300 placeholder-white/30"
                      />
                    </div>

                    {/* Playlist Container */}
                    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 space-y-3 flex flex-col">
                      <div className="px-2 pt-1 pb-3 border-b border-white/5 flex items-center justify-between text-xs text-white/40 font-bold uppercase tracking-wider">
                        <span>Course Syllabus</span>
                        <span className="text-orange-400">
                          {filteredVideos.length} Video{filteredVideos.length !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Scrollable list */}
                      <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1.5 no-scrollbar" data-lenis-prevent="true">
                        {filteredVideos.map((video, idx) => {
                          const isActive = activeVideo?.videoId === video.videoId;
                          const lectureNumber = videos.length - videos.findIndex((v) => v.videoId === video.videoId);

                          return (
                            <button
                              key={video.videoId}
                              onClick={() => setSearchParams({ v: video.videoId })}
                              className={`w-full flex items-start gap-3 rounded-2xl p-3 text-left transition duration-200 border ${
                                isActive
                                  ? "bg-orange-500/10 border-orange-500/40 text-white"
                                  : "bg-transparent border-transparent hover:bg-white/[0.04] text-white/70 hover:text-white"
                              }`}
                            >
                              {/* Sidebar Thumbnail */}
                              <div className="relative shrink-0 w-24 aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
                                <img
                                  src={video.thumbnailUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[9px] text-white/90">
                                  {video.duration}
                                </div>
                              </div>

                              {/* Sidebar Video details */}
                              <div className="min-w-0 flex-grow py-0.5">
                                <span className={`text-[9px] font-bold uppercase tracking-wider block mb-0.5 ${isActive ? "text-orange-400" : "text-white/40"}`}>
                                  Video {lectureNumber} {isActive && "• Playing"}
                                </span>
                                <h4 className="text-xs font-bold leading-snug line-clamp-2">
                                  {video.title}
                                </h4>
                                <span className="text-[9px] text-white/40 block mt-1.5 font-medium">
                                  {video.views >= 1000
                                    ? (video.views / 1000).toFixed(1) + "K"
                                    : video.views}{" "}
                                  Views
                                </span>
                              </div>
                            </button>
                          );
                        })}

                        {filteredVideos.length === 0 && (
                          <div className="py-6 text-center text-xs text-white/40">
                            No matching videos found.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </>
          )}

          {activeTab === "terms" && (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-10 backdrop-blur-md shadow-2xl space-y-8 leading-relaxed max-w-4xl mx-auto">
              <h2 className="text-3xl font-black text-orange-400 border-b border-white/10 pb-4">
                Terms & Conditions
              </h2>

              <div className="space-y-6 text-white/80">
                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    1. Agreement to Terms
                  </h3>
                  <p>
                    Welcome to Stack Adda. By accessing or using our platform,
                    services, and website, you agree to comply with and be bound
                    by these Terms & Conditions. If you do not agree to these
                    terms, please refrain from using our services.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    2. Educational Content & Intellectual Property
                  </h3>
                  <p>
                    All tutorial videos, code snippets, project documentation,
                    site designs, and text content displayed on Stack Adda
                    belong to Stack Adda and its creators. You are granted a
                    limited, personal, non-exclusive license to view and
                    download public resources for educational and learning
                    purposes only. Commercial resale or unauthorized
                    distribution of this material is strictly prohibited.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    3. Third-Party YouTube Content
                  </h3>
                  <p>
                    Our platform embeds YouTube players and links to direct
                    video feeds hosted on Google's YouTube service. By
                    interacting with the YouTube content on our website, you
                    also agree to be bound by the YouTube Terms of Service and
                    Google Privacy Policy. We hold no responsibility for
                    modifications or service disruptions on YouTube's platform.
                  </p>
                </section>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-10 backdrop-blur-md shadow-2xl space-y-8 leading-relaxed max-w-4xl mx-auto">
              <h2 className="text-3xl font-black text-orange-400 border-b border-white/10 pb-4">
                Privacy Policy
              </h2>

              <div className="space-y-6 text-white/80">
                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    1. Information Collection & Cookies
                  </h3>
                  <p>
                    We collect basic metadata logs, session credentials, and
                    account registration settings required to operate your dashboard.
                    Stack Adda embeds Google/YouTube tracking pixels to monitor
                    channel engagement. By playing videos, YouTube sets analytics and
                    preferences cookies.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">
                    2. Data Usage & Social Sharing
                  </h3>
                  <p>
                    Your data is solely utilized to process authentication. We do
                    not rent, share, or sell user records to advertising partners.
                    Configured Telegram and Instagram credentials for team members
                    are displayed publicly to facilitate direct communication with learners.
                  </p>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
    </>
  );
}
