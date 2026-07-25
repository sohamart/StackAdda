import { useEffect, useState } from "react";
import { Search, Loader2, PlayCircle, FileText, ShieldAlert, ArrowUpRight, Play, Clock3, Star } from "lucide-react";
import API from "../../api/axios";

export default function Courses() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("videos"); // "videos" | "terms" | "privacy"

  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/youtube")
      .then(({ data }) => setVideos(data.videos || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));

    API.get("/youtube/stats")
      .then(({ data }) => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(search.toLowerCase()) ||
    (video.description && video.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleWatch = (link) => {
    window.open(link, "_blank");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B]">
        <Loader2 className="animate-spin text-orange-500" size={48} />
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#09090B] px-5 pb-20 pt-32 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Banner Section */}
        <section className="relative overflow-hidden rounded-[2.25rem] border border-orange-500/20 bg-gradient-to-br from-orange-500/[.16] via-white/[.045] to-transparent p-7 md:p-12">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-orange-500/20 blur-[100px]" />
          <div className="relative max-w-3xl">
            <p className="text-sm font-semibold tracking-[.25em] text-orange-300">STACK ADDA RESOURCE HUB</p>
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
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition duration-300 ${
              activeTab === "videos"
                ? "bg-orange-500 text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)]"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <PlayCircle size={18} className={activeTab === "videos" ? "text-white" : "text-red-500"} />
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
          {activeTab === "videos" && (
            <>
              {/* Search Bar for Videos */}
              <div className="relative max-w-xl mb-10">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={20} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search YouTube tutorials..."
                  className="w-full rounded-2xl border border-white/15 bg-black/30 py-4 pl-12 pr-4 text-white outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm text-orange-400">CURATED VIDEO LESSONS</p>
                  <h2 className="mt-2 text-3xl font-bold">Latest Tutorials</h2>
                </div>
                <p className="text-sm text-white/45">
                  {filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""} found
                </p>
              </div>

              {/* Videos Grid */}
              <section className="mt-7 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                {filteredVideos.map((video, index) => (
                  <article
                    key={video.videoId || index}
                    className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[.045] shadow-[0_20px_60px_rgba(0,0,0,.22)] transition duration-500 hover:-translate-y-2 hover:border-orange-500/50"
                  >
                    <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-500/10 blur-3xl group-hover:bg-orange-500/25" />
                    
                    {/* Thumbnail */}
                    <div className="relative h-52 overflow-hidden cursor-pointer" onClick={() => handleWatch(video.link)}>
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

                      {/* Badges */}
                      <div className="absolute left-4 top-4 flex gap-2">
                        <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-orange-200 backdrop-blur">
                          Tutorial
                        </span>
                      </div>
                    </div>

                    {/* Description & Metadata */}
                    <div className="relative p-6">
                      <div className="flex items-center gap-1 text-sm text-orange-300">
                        <Star size={15} fill="currentColor" />
                        <span>4.9</span>
                        <span className="ml-1 text-white/40">(YouTube Review)</span>
                      </div>
                      
                      <h2 className="mt-3 text-2xl font-bold leading-tight line-clamp-2 min-h-[3.5rem] group-hover:text-orange-400 transition-colors">
                        <a href={video.link} target="_blank" rel="noreferrer">
                          {video.title}
                        </a>
                      </h2>
                      
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/55 min-h-[3rem]">
                        {video.description || "Access premium full-stack tutorials directly on YouTube."}
                      </p>

                      {/* Info Panel */}
                      <div className="mt-5 grid grid-cols-3 gap-2 border-y border-white/10 py-4 text-center text-xs text-white/55">
                        <span className="flex flex-col items-center gap-1">
                          <PlayCircle size={15} className="text-red-500" />
                          Free
                        </span>
                        <span className="flex flex-col items-center gap-1">
                          <Clock3 size={15} className="text-orange-400" />
                          {video.duration || "15:00"}
                        </span>
                        <span className="flex flex-col items-center gap-1">
                          <Star size={15} className="text-orange-400" />
                          Full HD
                        </span>
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-5 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-white/40">Watch for free</p>
                          <p className="mt-1 text-2xl font-black text-orange-300">Free</p>
                        </div>
                        <button
                          onClick={() => handleWatch(video.link)}
                          className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 flex items-center gap-1.5"
                        >
                          Watch Now <ArrowUpRight size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </section>

              {!filteredVideos.length && (
                <div className="mt-8 rounded-3xl border border-dashed border-white/15 p-16 text-center text-white/50">
                  No video tutorials match your search.
                </div>
              )}
            </>
          )}

          {activeTab === "terms" && (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-10 backdrop-blur-3xl shadow-2xl space-y-8 leading-relaxed max-w-4xl mx-auto">
              <h2 className="text-3xl font-black text-orange-400 border-b border-white/10 pb-4">
                Terms & Conditions
              </h2>
              
              <div className="space-y-6 text-white/80">
                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">1. Agreement to Terms</h3>
                  <p>
                    Welcome to Stack Adda. By accessing or using our platform, services, and website, you agree to comply with and be bound by these Terms & Conditions. If you do not agree to these terms, please refrain from using our services.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">2. Educational Content & Intellectual Property</h3>
                  <p>
                    All tutorial videos, code snippets, project documentation, site designs, and text content displayed on Stack Adda belong to Stack Adda and its creators. You are granted a limited, personal, non-exclusive license to view and download public resources for educational and learning purposes only. Commercial resale or unauthorized distribution of this material is strictly prohibited.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">3. YouTube Integration & Services</h3>
                  <p>
                    Our platform embeds YouTube players and links to direct video feeds hosted on Google's YouTube service. By interacting with the YouTube content on our website, you also agree to be bound by the YouTube Terms of Service and Google Privacy Policy. We hold no responsibility for modifications or service disruptions on YouTube's platform.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">4. User Account & Conduct</h3>
                  <p>
                    If you register an account on Stack Adda, you are responsible for maintaining the confidentiality of your login credentials. You agree not to engage in any activity that disrupts the website's servers, network integrity, or other users' experiences.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">5. Disclaimer of Warranties</h3>
                  <p>
                    The service, resources, and tutorials are provided on an "as-is" and "as-available" basis. While we strive to present accurate engineering tutorials and concepts, Stack Adda makes no warranty regarding the suitability of the code for production environments or career placement guarantees.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">6. Changes to Terms</h3>
                  <p>
                    We reserve the right to modify these Terms at any time. Any changes will be posted on this page with an updated effective date. Continued use of the platform constitutes agreement to the updated terms.
                  </p>
                </section>

                <div className="border-t border-white/10 pt-6 mt-8 text-sm text-white/50">
                  <p>Last Updated: July 2026</p>
                  <p className="mt-1">For inquiries, contact us at: <a href="mailto:stackaddacontact@gmail.com" className="text-orange-400 hover:underline">stackaddacontact@gmail.com</a></p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-10 backdrop-blur-3xl shadow-2xl space-y-8 leading-relaxed max-w-4xl mx-auto">
              <h2 className="text-3xl font-black text-orange-400 border-b border-white/10 pb-4">
                Privacy Policy
              </h2>

              <div className="space-y-6 text-white/80">
                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">1. Information We Collect</h3>
                  <p>
                    Stack Adda values user privacy. We do not sell or trade your data. The information we may collect includes:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1.5 text-white/70">
                    <li>Basic account detail (Name, Email) upon registration.</li>
                    <li>Contact query data (Name, Email, Message body) sent through our contact form.</li>
                    <li>Technical data such as browser type, device details, and general website navigation statistics to help optimize performance.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">2. Use of Information</h3>
                  <p>
                    We use your information solely to:
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1.5 text-white/70">
                    <li>Provide and maintain user profiles and platform access.</li>
                    <li>Respond to contact queries, requests, or bug reports.</li>
                    <li>Analyze technical behaviors to improve website speed and layout.</li>
                  </ul>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">3. YouTube Cookies & Third-Party Players</h3>
                  <p>
                    Stack Adda integrates embedded YouTube video interfaces. Watching YouTube content on our site enables YouTube's tracking cookies. YouTube may record your viewing history, device diagnostics, and display preferences as regulated under Google's Privacy Policies. You can manage or clear your cookie preferences directly in your browser settings.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">4. Data Security</h3>
                  <p>
                    We implement industry-standard database encryption and secure communication layers (HTTPS) to safeguard your personal credentials and communication data. However, please remember that no method of transmission over the internet is 100% secure.
                  </p>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xl font-bold text-white">5. Your Rights</h3>
                  <p>
                    You have the right to request access to the personal data we hold about you, request corrections to obsolete profile details, or ask for account deletion. If you wish to delete your Stack Adda profile, please email our support address.
                  </p>
                </section>

                <div className="border-t border-white/10 pt-6 mt-8 text-sm text-white/50">
                  <p>Last Updated: July 2026</p>
                  <p className="mt-1">For inquiries, contact us at: <a href="mailto:stackaddacontact@gmail.com" className="text-orange-400 hover:underline">stackaddacontact@gmail.com</a></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
