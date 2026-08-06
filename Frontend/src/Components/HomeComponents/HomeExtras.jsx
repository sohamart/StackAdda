import { useEffect, useState } from "react";
import { Star, X, MessageSquare, Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import API from "../../api/axios";
import StructuredCourses from "./StructuredCourses";
import HomeShorts from "./HomeShorts";

const fallbackTeam = [
  {
    name: "Soham Dutta",
    role: "Founder & Full-stack Developer",
    image:
      "https://ui-avatars.com/api/?name=Soham+Dutta&size=500&background=f97316&color=ffffff&bold=true",
  },
  {
    name: "Sayantan Ghosh",
    role: "Co-Founder & UI/UX Designer, Backend Devoloper",
    image:
      "https://ui-avatars.com/api/?name=Sayantan+Ghosh&size=500&background=27272a&color=f97316&bold=true",
  },
  {
    name: "Achinta Bej",
    role: "Co-Founder & Community Manager",
    image:
      "https://ui-avatars.com/api/?name=Achinta+Bej&size=500&background=171717&color=ffffff&bold=true",
  },
];

const fallbackReviews = [
  {
    name: "Riya Das",
    text: "The lessons are clear, structured and easy to follow. I finally built my first real project.",
    role: "Frontend Learner",
    rating: 5,
  },
  {
    name: "Arjun Saha",
    text: "The learning dashboard makes it simple to stay focused and track every lesson.",
    role: "DSA Learner",
    rating: 5,
  },
  {
    name: "Priya Roy",
    text: "A premium learning experience with genuinely practical course content.",
    role: "Web Development Learner",
    rating: 5,
  },
];

export default function HomeExtras() {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);

  // Reviews states
  const [allReviews, setAllReviews] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRole, setNewReviewRole] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  useEffect(() => {
    // Fetch Teammates
    API.get("/youtube/teammates")
      .then(({ data }) => {
        if (data.success && data.teammates && data.teammates.length > 0) {
          setTeam(data.teammates);
        } else {
          setTeam(fallbackTeam);
        }
      })
      .catch(() => {
        setTeam(fallbackTeam);
      })
      .finally(() => {
        setTeamLoading(false);
      });

    // Fetch Reviews
    API.get("/review")
      .then(({ data }) => {
        if (data.success && data.reviews) {
          setAllReviews(data.reviews);
        } else {
          setAllReviews(fallbackReviews);
        }
      })
      .catch(() => {
        setAllReviews(fallbackReviews);
      });
  }, []);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) {
      return toast.error("Please enter your review text.");
    }

    try {
      setSubmitLoading(true);
      const { data } = await API.post(
        "/review",
        {
          text: newReviewText.trim(),
          role: newReviewRole.trim() || "Student Learner",
          rating: newReviewRating,
        },
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        // Prepend new review to state
        setAllReviews((prev) => [data.review, ...prev]);
        // Reset form
        setNewReviewText("");
        setNewReviewRole("");
        setNewReviewRating(5);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      {/* Team Section */}
      <section className="relative mx-auto max-w-7xl overflow-hidden px-5 py-24 text-white">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="relative">
          <p className="text-center text-sm font-semibold tracking-[.25em] text-orange-400">
            THE PEOPLE BEHIND STACK ADDA
          </p>

          <h2 className="mt-4 text-center text-4xl font-black">
            Learn with builders.
          </h2>

          {teamLoading ? (
            /* Shimmer Skeleton Loading */
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border border-white/5 bg-white/[0.02] p-5 text-center backdrop-blur-2xl"
                >
                  <div className="mx-auto h-36 w-36 rounded-3xl bg-white/5" />
                  <div className="mx-auto mt-6 h-6 w-32 rounded-lg bg-white/5" />
                  <div className="mx-auto mt-3 h-4 w-44 rounded-lg bg-white/5" />
                </div>
              ))}
            </div>
          ) : (
            /* Dynamic Team Grid */
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {team.map((member, index) => {
                const imageSrc =
                  member.profileImage?.url ||
                  member.image ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    member.name
                  )}&size=500&background=f97316&color=ffffff&bold=true`;

                return (
                  <article
                    key={member._id || member.name}
                    className="group rounded-3xl border border-white/10 bg-white/[.045] p-5 text-center backdrop-blur-2xl transition duration-500 hover:-translate-y-3 hover:border-orange-500/50"
                    style={{
                      animation: `float ${4 + index}s ease-in-out infinite`,
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt={member.name}
                      className="mx-auto h-36 w-36 rounded-3xl border border-orange-500/30 object-cover transition group-hover:scale-105"
                    />

                    <h3 className="mt-5 text-xl font-bold">{member.name}</h3>

                    <p className="mt-1 text-sm text-orange-300">
                      {member.role || member.bio || "Team Member"}
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Structured Courses Section */}
      <StructuredCourses />

      {/* Shorts Section */}
      <HomeShorts />

      {/* Reviews Section */}
      <section className="border-y border-white/10 bg-white/[.025] px-5 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm font-semibold tracking-[.25em] text-orange-400">
            STUDENT STORIES
          </p>

          <h2 className="mt-4 text-center text-4xl font-black">
            Loved by learners.
          </h2>

          {/* Top 3 Reviews (Only 5-star ratings) */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {allReviews
              .filter((review) => (review.rating || 5) === 5)
              .slice(0, 3)
              .map((review, i) => (
              <article
                key={review._id || i}
                className="rounded-3xl border border-white/10 bg-black/20 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-orange-400">
                    {Array.from({ length: review.rating || 5 }).map((_, index) => (
                      <Star key={index} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-5 leading-7 text-white/70">"{review.text}"</p>
                </div>
                <div className="mt-6">
                  <h3 className="font-bold text-white">{review.name}</h3>
                  <p className="text-xs text-white/45 mt-0.5">{review.role}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Read More Trigger */}
          <div className="mt-12 text-center">
            <button
              onClick={() => setOpenModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 transition px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/20 hover:scale-105 duration-200"
            >
              Read More Reviews & Submit Yours
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Details & Submission Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-5xl rounded-[2.5rem] border border-white/10 bg-[#0c0c0e] p-6 sm:p-10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-6 top-6 z-20 rounded-full border border-white/15 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Glowing background inside modal */}
            <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-orange-500/5 blur-xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row gap-8 overflow-y-auto no-scrollbar flex-grow">
              
              {/* Left Column: Submit Form */}
              <div className="w-full md:w-5/12 space-y-6">
                <div>
                  <span className="text-[11px] font-bold tracking-widest text-orange-400 uppercase">
                    Your Feedback
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">
                    Share your experience
                  </h3>
                  <p className="text-xs text-white/50 mt-2">
                    Help other learners by sharing your genuine thoughts about Stack Adda.
                  </p>
                </div>

                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    
                    {/* Logged in indicator */}
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-white/60">
                      Submitting as <strong className="text-white">{user.name}</strong>
                    </div>

                    {/* Review text */}
                    <div>
                      <label className="text-xs font-semibold text-white/70 uppercase">
                        Review Content
                      </label>
                      <textarea
                        required
                        rows="4"
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        placeholder="Write your review here..."
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white placeholder-white/30 focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    {/* Learning Track/Role */}
                    <div>
                      <label className="text-xs font-semibold text-white/70 uppercase">
                        Learning Track
                      </label>
                      <input
                        type="text"
                        value={newReviewRole}
                        onChange={(e) => setNewReviewRole(e.target.value)}
                        placeholder="e.g. Web Dev Learner"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    {/* Interactive Star Selection */}
                    <div>
                      <label className="text-xs font-semibold text-white/70 uppercase block">
                        Rating
                      </label>
                      <div className="flex gap-2 mt-2.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className="text-orange-400 hover:scale-110 transition duration-150"
                          >
                            <Star
                              size={26}
                              fill={star <= newReviewRating ? "currentColor" : "none"}
                              stroke="currentColor"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 transition hover:scale-[1.02] duration-200"
                    >
                      {submitLoading ? (
                        <Loader2 className="animate-spin" size={18} />
                      ) : (
                        <>
                          <Sparkles size={16} /> Publish Review
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 text-center">
                    <MessageSquare size={36} className="mx-auto text-orange-400/40 mb-3" />
                    <p className="text-sm text-white/70">
                      Please login as a student to submit your review.
                    </p>
                    <Link
                      to="/login"
                      onClick={() => setOpenModal(false)}
                      className="mt-4 inline-block rounded-xl bg-orange-500 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600"
                    >
                      Login to Submit
                    </Link>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px bg-white/10 self-stretch my-2" />

              {/* Right Column: All Reviews Scroll */}
              <div className="w-full md:w-7/12 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-4">
                  Learner Stories ({allReviews.length})
                </h3>
                <div className="space-y-4 overflow-y-auto flex-grow max-h-[50vh] pr-2 no-scrollbar">
                  {allReviews.map((review, index) => (
                    <div
                      key={review._id || index}
                      className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">{review.name}</h4>
                        <div className="flex gap-0.5 text-orange-400">
                          {Array.from({ length: review.rating || 5 }).map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed">
                        "{review.text}"
                      </p>
                      <div className="text-[10px] text-white/40 font-medium">
                        {review.role}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#09090B] px-5 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p className="text-lg font-bold text-orange-400">Stack Adda</p>

          <p>Learn. Build. Get Placed.</p>

          <p>© {new Date().getFullYear()} Stack Adda. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
