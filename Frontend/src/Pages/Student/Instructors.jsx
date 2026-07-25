import { useEffect, useState } from "react";
import { Mail, MessageCircle, Send, Loader2, Award } from "lucide-react";
import API from "../../api/axios";

// Custom inline Instagram icon since older lucide-react versions do not export it
const InstagramIcon = ({ size = 16, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/youtube/instructors")
      .then(({ data }) => {
        if (data.success) {
          setInstructors(data.instructors || []);
        }
      })
      .catch((err) => console.error("Failed to load instructors", err))
      .finally(() => setLoading(false));
  }, []);

  const getInstagramLink = (username) => {
    if (!username) return "";
    if (username.startsWith("http://") || username.startsWith("https://")) {
      return username;
    }
    const clean = username.startsWith("@") ? username.slice(1) : username;
    return `https://instagram.com/${clean}`;
  };

  const getTelegramLink = (username) => {
    if (!username) return "";
    if (username.startsWith("http://") || username.startsWith("https://")) {
      return username;
    }
    const clean = username.startsWith("@") ? username.slice(1) : username;
    return `https://t.me/${clean}`;
  };

  return (
    <div className="space-y-8 text-white pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black flex items-center gap-2">
          <Award size={32} className="text-orange-400" /> Support & Instructors
        </h1>
        <p className="mt-2 text-white/50 text-sm">
          Connect directly with our instructors and team members for support, questions, and guidance.
        </p>
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader2 className="animate-spin text-orange-500" size={38} />
        </div>
      ) : instructors.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-12 text-center text-white/50">
          <MessageCircle size={48} className="mx-auto text-orange-400/50 mb-4" />
          <h3 className="text-lg font-bold text-white">No Instructors Published Yet</h3>
          <p className="mt-1 text-sm text-white/40">
            Check back later to connect with our support team.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => {
            const avatar =
              instructor.profileImage?.url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                instructor.name
              )}&background=f97316&color=fff&size=200&bold=true`;

            const instaUrl = getInstagramLink(instructor.instagram);
            const teleUrl = getTelegramLink(instructor.telegram);

            return (
              <article
                key={instructor._id}
                className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-3xl transition duration-350 hover:-translate-y-2 hover:border-orange-500/40"
              >
                {/* Glow behind photo */}
                <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-orange-500/10 blur-2xl group-hover:bg-orange-500/20 transition-all duration-550" />

                <div className="relative flex flex-col items-center text-center">
                  {/* Photo */}
                  <img
                    src={avatar}
                    alt={instructor.name}
                    className="h-28 w-28 rounded-3xl border-2 border-orange-500/30 object-cover group-hover:scale-105 transition duration-300"
                  />

                  {/* Name & Bio */}
                  <h3 className="mt-5 text-xl font-bold text-white">{instructor.name}</h3>
                  <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest mt-1">
                    Instructor
                  </span>
                  
                  <p className="mt-3 text-sm text-white/60 line-clamp-3 leading-relaxed min-h-[3.75rem]">
                    {instructor.bio || "Full-stack developer at Stack Adda ready to help you on your coding journey."}
                  </p>

                  {/* Contact Buttons */}
                  <div className="mt-6 border-t border-white/10 pt-6 w-full flex flex-col gap-3">
                    
                    {/* Email */}
                    <a
                      href={`mailto:${instructor.email}`}
                      className="flex items-center justify-center gap-2.5 rounded-2xl bg-white/5 border border-white/10 py-3 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white text-sm"
                    >
                      <Mail size={16} className="text-orange-400" />
                      Email Instructor
                    </a>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Instagram */}
                      {instructor.instagram ? (
                        <a
                          href={instaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-2xl bg-[#E1306C]/10 border border-[#E1306C]/20 py-3 font-semibold text-[#E1306C] transition hover:bg-[#E1306C]/20 text-sm"
                        >
                          <InstagramIcon size={16} />
                          Instagram
                        </a>
                      ) : (
                        <span className="flex items-center justify-center gap-2 rounded-2xl bg-white/[0.02] border border-white/5 py-3 text-white/20 text-sm cursor-not-allowed select-none">
                          <InstagramIcon size={16} />
                          No Insta
                        </span>
                      )}

                      {/* Telegram */}
                      {instructor.telegram ? (
                        <a
                          href={teleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 rounded-2xl bg-[#229ED9]/10 border border-[#229ED9]/20 py-3 font-semibold text-[#229ED9] transition hover:bg-[#229ED9]/20 text-sm"
                        >
                          <Send size={15} />
                          Telegram
                        </a>
                      ) : (
                        <span className="flex items-center justify-center gap-2 rounded-2xl bg-white/[0.02] border border-white/5 py-3 text-white/20 text-sm cursor-not-allowed select-none">
                          <Send size={15} />
                          No Telegram
                        </span>
                      )}
                    </div>

                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
