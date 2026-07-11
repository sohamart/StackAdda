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
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [transactionId, setTransactionId] = useState("");
  const [confirmingPayment, setConfirmingPayment] = useState(false);

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

  const startPaidCheckout = async () => {
    if (!user) return navigate("/login");

    try {
      setLoading(true);

      const { data } = await API.post("/payment/create-order", {
        courseId: course._id,
      });

      setPaymentRequest({
        paymentId: data.paymentId,
        amount: data.amount,
        currency: data.currency,
        upi: data.upi,
      });
      setTransactionId("");
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          e.message ||
          "Payment could not be started."
      );
    }
    setLoading(false);
  };

  const confirmManualPayment = async () => {
    if (!paymentRequest?.paymentId) return;

    if (!transactionId.trim()) {
      toast.error("Enter your UTR or transaction reference.");
      return;
    }

    try {
      setConfirmingPayment(true);
      const { data } = await API.post("/payment/verify", {
        paymentId: paymentRequest.paymentId,
        transactionId: transactionId.trim(),
      });

      toast.success(data.message);
      setPaymentRequest(null);
      setTransactionId("");
      navigate(`/student/course/${data.courseId || course._id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Payment verification failed.");
    } finally {
      setConfirmingPayment(false);
    }
  };

  const copyUpiId = async () => {
    if (!paymentRequest?.upi?.payeeVpa) return;

    try {
      await navigator.clipboard.writeText(paymentRequest.upi.payeeVpa);
      toast.success("UPI ID copied.");
    } catch {
      toast.error("Could not copy UPI ID.");
    }
  };

  const closePaymentModal = () => {
    setPaymentRequest(null);
    setTransactionId("");
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
      navigate("/student/courses");
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not enroll.");
    } finally {
      setLoading(false);
    }
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

  return (
    <main className="min-h-screen bg-[#09090B] px-4 pb-20 pt-28 text-white sm:px-6 md:px-10 md:pt-32">
      <div className="mx-auto max-w-7xl">
        <Link to="/courses" className="text-sm font-medium text-orange-400">
          Back to courses
        </Link>

        <section className="relative mt-6 overflow-hidden rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/[.14] via-white/[.045] to-transparent p-5 sm:p-7 md:p-10">
          <div className="absolute -right-28 -top-24 h-96 w-96 rounded-full bg-orange-500/20 blur-[120px]" />

          <div className="relative grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-orange-500/15 px-3 py-1 text-sm text-orange-200">
                  {course.category}
                </span>

                <span className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/65">
                  {course.level}
                </span>
              </div>

              <h1 className="mt-5 break-words text-3xl font-black leading-tight sm:text-4xl md:text-6xl">
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

            <aside className="rounded-3xl border border-white/15 bg-[#15110f]/80 p-4 shadow-2xl backdrop-blur sm:p-5">
              <img
                src={
                  course.thumbnail?.url ||
                  "https://placehold.co/900x500/18181b/f97316?text=Stack+Adda"
                }
                alt={course.title}
                className="aspect-video w-full rounded-2xl object-cover"
              />

              <p className="mt-5 text-3xl font-black text-orange-300">
                {course.accessType === "free" ? "Free" : `Rs ${course.price}`}
              </p>

              <p className="mt-1 text-sm text-white/45">
                One-time payment - Lifetime access
              </p>

              <button
                disabled={loading}
                onClick={enroll}
                className="mt-5 w-full rounded-xl bg-orange-500 py-3.5 font-bold transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? course.accessType === "paid"
                    ? "Preparing payment..."
                    : "Enrolling..."
                  : course.accessType === "free"
                  ? "Enroll now"
                  : "Pay via UPI"}
              </button>

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

                    <span className="min-w-0 flex-1 break-words font-semibold">
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

                          <span className="min-w-0 flex-1 break-words">
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
                className="rounded-3xl border border-white/10 bg-white/[.04] p-6"
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

      {paymentRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-[2rem] border border-orange-500/20 bg-[#111113] p-5 shadow-2xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-[.2em] text-orange-400">
                  UPI PAYMENT
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">
                  Complete payment for {course.title}
                </h3>
              </div>

              <button
                onClick={closePaymentModal}
                className="rounded-full border border-white/10 p-2 text-white/60 transition hover:border-white/20 hover:text-white"
                aria-label="Close payment dialog"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[.04] p-5">
              <p className="text-sm text-white/55">Amount to pay</p>
              <p className="mt-1 text-3xl font-black text-orange-300">
                ₹{Number(paymentRequest.amount || 0).toFixed(2)}
              </p>

              <div className="mt-5 space-y-3 text-sm text-white/70">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-white/45">Pay to</p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {paymentRequest.upi?.payeeName || "Stack Adda"}
                  </p>
                  <p className="mt-1 break-words text-orange-300">
                    {paymentRequest.upi?.payeeVpa}
                  </p>
                </div>

                <a
                  href={paymentRequest.upi?.intentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 font-bold text-black transition hover:bg-orange-400"
                >
                  Open UPI app
                  <ExternalLink size={17} />
                </a>

                <button
                  onClick={copyUpiId}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 px-4 py-3 font-semibold text-white transition hover:border-orange-400/50 hover:text-orange-200"
                >
                  <Copy size={17} />
                  Copy UPI ID
                </button>
              </div>

              <p className="mt-5 text-sm leading-6 text-white/50">
                After sending the payment, paste your UTR or transaction reference below and submit it. We will unlock the course after confirmation.
              </p>

              <div className="mt-5 space-y-3">
                <label className="block text-sm font-medium text-white/70">
                  Transaction / UTR number
                </label>
                <input
                  value={transactionId}
                  onChange={(event) => setTransactionId(event.target.value)}
                  placeholder="Enter UTR or transaction ID"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-orange-500"
                />

                <button
                  disabled={confirmingPayment}
                  onClick={confirmManualPayment}
                  className="w-full rounded-2xl bg-orange-500 py-3.5 font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {confirmingPayment ? "Submitting..." : "I have paid"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
