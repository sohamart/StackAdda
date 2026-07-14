import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Award,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  Infinity as InfinityIcon,
  Loader2,
  PlayCircle,
  Star,
  Users,
  X,
  ExternalLink,
  Share2,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../Context/AuthContext";
import API from "../../api/axios";

const testimonials = [
  {
    name: "Riya Das",
    role: "Frontend learner",
    text: "The lesson structure made difficult ideas feel approachable. I completed my project with confidence.",
  },
  {
    name: "Arjun Saha",
    role: "Student",
    text: "Practical, focused and very easy to follow. The resources alongside each lesson are a huge plus.",
  },
  {
    name: "Priya Roy",
    role: "Career switcher",
    text: "This course gave me a clear path instead of random tutorials. Worth every minute.",
  },
];

export default function CourseDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [open, setOpen] = useState({});
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    API.get(`/course/${slug}`)
      .then(({ data }) => {
        const nextCourse = data.course;
        setCourse(nextCourse);
        setOpen({
          [nextCourse.chapters?.[0]?._id]: true,
        });
      })
      .catch((e) =>
        toast.error(e.response?.data?.message || "Course not found.")
      );
  }, [slug]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Course link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  const startPaidCheckout = async () => {
    if (!user) return navigate("/login");

    try {
      setLoading(true);

      const { data } = await API.post("/payment/create-order", {
        courseId: course._id,
        couponCode: appliedCoupon ? appliedCoupon.code : "",
      });

      if (data.isFree) {
        toast.success(data.message || "Enrolled successfully.");
        navigate(`/student/course/${course._id}`);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount * 100, // amount in paise
        currency: data.currency,
        name: "Stack Adda",
        description: `Payment for ${course.title}`,
        order_id: data.razorpayOrderId,
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await API.post("/payment/verify", {
              paymentId: data.paymentId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success(verifyRes.data.message || "Payment verified successfully.");
            
            // Navigate to the learn portal directly
            navigate(`/student/course/${course._id}`);
          } catch (err) {
            toast.error(err.response?.data?.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "",
        },
        theme: {
          color: "#f97316",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
        e.message ||
        "Payment could not be started."
      );
    } finally {
      setLoading(false);
    }
  };

  const enroll = async () => {
    if (!user) return navigate("/login");

    if (course.accessType === "paid") {
      return startPaidCheckout();
    }

    try {
      setLoading(true);

      const { data } = await API.post(`/course/enroll/${course._id}`);

      toast.success(data.message);
      navigate(`/student/course/${course._id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not enroll.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      setValidatingCoupon(true);
      setCouponError("");
      const { data } = await API.post("/coupon/validate", {
        code: couponCode.trim(),
        courseId: course._id,
      });
      setAppliedCoupon(data.coupon);
      toast.success("Coupon applied successfully!");
    } catch (e) {
      setAppliedCoupon(null);
      setCouponError(e.response?.data?.message || "Invalid coupon.");
      toast.error(e.response?.data?.message || "Invalid coupon.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const calculateFinalPrice = () => {
    let price = course.price;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === "percentage") {
        let discount = (price * appliedCoupon.discountValue) / 100;
        if (appliedCoupon.maxDiscount > 0 && discount > appliedCoupon.maxDiscount) {
          discount = appliedCoupon.maxDiscount;
        }
        price -= discount;
      } else {
        price -= appliedCoupon.discountValue;
      }
    }
    return Math.max(0, price);
  };

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090B]">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    );
  }

  const chapters = course.chapters || [];
  const lessons = chapters.reduce(
    (sum, chapter) => sum + (chapter.lessons?.length || 0),
    0
  );
  const preview = chapters
    .flatMap((chapter) => chapter.lessons || [])
    .find((lesson) => lesson.isPreview && lesson.video?.url);

  const isEnrolled = user && (user.role === "admin" || user.enrolledCourses?.includes(course._id));

  return (
    <main className="min-h-screen bg-[#09090B] px-4 pb-20 pt-28 text-white sm:px-6 md:px-10 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <Link to="/courses" className="text-sm font-medium text-orange-400">
          Back to courses
        </Link>

        <div className="mt-4 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0 rounded-full bg-orange-500/20 p-1 text-orange-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-orange-400">Important Note on Course Videos</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/70">
                You will only be able to view the course videos if you are logged into your browser and YouTube with the <strong>exact same email address</strong> you used to register for this account. Videos are personally invited to your registered email for security.
              </p>
            </div>
          </div>
        </div>

        <section className="relative mt-6 overflow-hidden rounded-3xl border border-orange-500/20 bg-linear-to-br from-orange-500/[.14] via-white/4.5 to-transparent p-5 sm:p-7 md:p-10">
          <div className="absolute -right-28 -top-24 h-96 w-96 rounded-full bg-orange-500/20 blur-[120px]" />

          <div className="relative grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)]">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-orange-500/15 px-3 py-1 text-sm text-orange-200">
                  {course.category}
                </span>

                <span className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/65">
                  {course.level}
                </span>
              </div>

              <h1 className="mt-5 wrap-break-word text-3xl font-black leading-tight sm:text-4xl md:text-6xl">
                {course.title}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
                {course.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-4 text-sm text-white/70 sm:gap-5">
                <span className="flex items-center gap-2">
                  <Star
                    size={17}
                    fill="currentColor"
                    className="text-orange-400"
                  />
                  {course.averageRating?.toFixed(1) || "4.8"} rating
                </span>

                <span className="flex items-center gap-2">
                  <Users size={17} className="text-orange-400" />
                  {course.students?.length || "500+"} learners
                </span>

                <span className="flex items-center gap-2">
                  <Clock3 size={17} className="text-orange-400" />
                  {course.duration || "Self paced"}
                </span>
              </div>
            </div>

            <aside className="min-w-0 w-full rounded-3xl border border-white/15 bg-[#15110f]/80 p-4 shadow-2xl backdrop-blur sm:p-5">
              <img
                src={
                  course.thumbnail?.url ||
                  "https://placehold.co/900x500/18181b/f97316?text=Stack+Adda"
                }
                alt={course.title}
                className="aspect-video w-full rounded-2xl object-cover"
              />

              <div className="mt-5 flex items-start justify-between gap-3">
                <div className="flex items-end gap-3">
                  <p className="text-3xl font-black text-orange-300">
                    {course.accessType === "free" ? "Free" : `Rs ${calculateFinalPrice()}`}
                  </p>
                  {appliedCoupon && (
                    <p className="text-lg text-white/50 line-through pb-1">
                      Rs {course.price}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleShare}
                  className="rounded-full border border-white/10 bg-white/5 p-2.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                  title="Share Course"
                >
                  <Share2 size={18} />
                </button>
              </div>

              <p className="mt-1 text-sm text-white/45">
                One-time payment - Lifetime access
              </p>

              {!isEnrolled && course.accessType === "paid" && (
                <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                  {!appliedCoupon ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                          placeholder="Enter coupon code"
                          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-orange-500 uppercase placeholder:normal-case"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={validatingCoupon || !couponCode.trim()}
                          className="rounded-lg bg-orange-500/20 px-4 py-2 text-sm font-medium text-orange-400 hover:bg-orange-500/30 disabled:opacity-50"
                        >
                          {validatingCoupon ? "..." : "Apply"}
                        </button>
                      </div>
                      {couponError && <p className="text-xs text-red-400">{couponError}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-green-400">
                        <CheckCircle2 size={16} />
                        Coupon "{appliedCoupon.code}" applied
                      </div>
                      <button onClick={removeCoupon} className="text-xs text-white/50 hover:text-white">Remove</button>
                    </div>
                  )}
                </div>
              )}

              {isEnrolled ? (
                <Link
                  to={`/student/course/${course._id}`}
                  className="mt-5 block w-full text-center rounded-xl bg-orange-500 py-3.5 font-bold transition hover:bg-orange-600 text-white"
                >
                  Go to Course
                </Link>
              ) : (
                <button
                  disabled={loading}
                  onClick={enroll}
                  className="mt-5 w-full rounded-xl bg-orange-500 py-3.5 font-bold transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? course.accessType === "paid"
                      ? "Preparing payment..."
                      : "Enrolling..."
                    : course.accessType === "free" || (course.accessType === "paid" && calculateFinalPrice() === 0)
                      ? "Enroll now"
                      : "Pay with Razorpay"}
                </button>
              )}

              {preview && (
                <Link
                  to={`/courses/${slug}/preview/${preview._id}`}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 py-3 font-medium transition hover:border-orange-500"
                >
                  <PlayCircle size={18} />
                  Watch free preview
                </Link>
              )}
            </aside>
          </div>
        </section>

        <section className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div className="min-w-0">
            <h2 className="text-3xl font-black">What you'll get</h2>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                `${lessons || "12"} structured lessons`,
                "Downloadable lesson resources",
                "Progress tracking dashboard",
                "Lifetime course access",
                "Practical project-based learning",
                "Premium student learning workspace",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.035] p-4 text-white/75"
                >
                  <CheckCircle2 className="text-orange-400" size={18} />
                  <span className="min-w-0">{item}</span>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-3xl font-black">Course curriculum</h2>

            <div className="mt-5 space-y-3">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter._id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.035]"
                >
                  <button
                    onClick={() =>
                      setOpen({
                        ...open,
                        [chapter._id]: !open[chapter._id],
                      })
                    }
                    className="flex w-full items-center gap-3 p-4 text-left sm:p-5"
                  >
                    <span className="text-orange-400">
                      {open[chapter._id] ? (
                        <ChevronDown size={19} />
                      ) : (
                        <ChevronRight size={19} />
                      )}
                    </span>

                    <span className="min-w-0 flex-1 wrap-break-word font-semibold">
                      {index + 1}. {chapter.title}
                    </span>

                    <span className="shrink-0 text-sm text-white/45">
                      {chapter.lessons?.length || 0} lessons
                    </span>
                  </button>

                  {open[chapter._id] && (
                    <div className="border-t border-white/10 p-3">
                      {(chapter.lessons || []).map((lesson) => (
                        <div
                          key={lesson._id}
                          className="flex items-center gap-3 rounded-xl p-3 text-sm text-white/65"
                        >
                          <PlayCircle
                            size={17}
                            className="shrink-0 text-orange-400"
                          />

                          <span className="min-w-0 flex-1 wrap-break-word">
                            {lesson.title}
                          </span>

                          {lesson.isPreview && (
                            <Link
                              to={`/courses/${slug}/preview/${lesson._id}`}
                              className="shrink-0 text-xs font-semibold text-green-300"
                            >
                              Preview
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <aside>
            <div className="rounded-3xl border border-white/10 bg-white/[.035] p-6">
              <h3 className="text-xl font-bold">This course includes</h3>

              <div className="mt-5 space-y-4 text-sm text-white/65">
                <p className="flex gap-3">
                  <FileText size={18} className="shrink-0 text-orange-400" />
                  Notes and downloadable resources
                </p>

                <p className="flex gap-3">
                  <InfinityIcon
                    size={18}
                    className="shrink-0 text-orange-400"
                  />
                  Lifetime access
                </p>

                <p className="flex gap-3">
                  <Award size={18} className="shrink-0 text-orange-400" />
                  Learn at your own pace
                </p>
              </div>
            </div>
          </aside>
        </section>

        <section className="mt-16">
          <p className="text-sm font-semibold tracking-[.2em] text-orange-400">
            STUDENT REVIEWS
          </p>

          <h2 className="mt-3 text-3xl font-black">
            What learners are saying
          </h2>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {testimonials.map((review) => (
              <article
                key={review.name}
                className="rounded-3xl border border-white/10 bg-white/4 p-6"
              >
                <div className="flex gap-1 text-orange-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className="mt-5 leading-7 text-white/70">
                  "{review.text}"
                </p>

                <h3 className="mt-6 font-bold">{review.name}</h3>

                <p className="text-sm text-white/45">{review.role}</p>
              </article>
            ))}
          </div>
        </section>
      </div>


    </main>
  );
}
