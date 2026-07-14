import { Star } from "lucide-react";

const team = [
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

const reviews = [
  {
    name: "Riya Das",
    text: "The lessons are clear, structured and easy to follow. I finally built my first real project.",
    role: "Frontend Learner",
  },
  {
    name: "Arjun Saha",
    text: "The learning dashboard makes it simple to stay focused and track every lesson.",
    role: "DSA Learner",
  },
  {
    name: "Priya Roy",
    text: "A premium learning experience with genuinely practical course content.",
    role: "Web Development Learner",
  },
];

export default function HomeExtras() {
  return (
    <>
      {/* Team Section */}
      <section className="relative mx-auto max-w-7xl overflow-hidden px-5 py-24 text-white">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[140px]" />

        <div className="relative">
          <p className="text-center text-sm font-semibold tracking-[.25em] text-orange-400">
            THE PEOPLE BEHIND STACK ADDA
          </p>

          <h2 className="mt-4 text-center text-4xl font-black">
            Learn with builders.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {team.map((member, index) => (
              <article
                key={member.name}
                className="group rounded-3xl border border-white/10 bg-white/[.045] p-5 text-center backdrop-blur-2xl transition duration-500 hover:-translate-y-3 hover:border-orange-500/50"
                style={{
                  animation: `float ${4 + index}s ease-in-out infinite`,
                }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="mx-auto h-36 w-36 rounded-3xl border border-orange-500/30 object-cover transition group-hover:scale-105"
                />

                <h3 className="mt-5 text-xl font-bold">
                  {member.name}
                </h3>

                <p className="mt-1 text-sm text-orange-300">
                  {member.role}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="border-y border-white/10 bg-white/[.025] px-5 py-24 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-sm font-semibold tracking-[.25em] text-orange-400">
            STUDENT STORIES
          </p>

          <h2 className="mt-4 text-center text-4xl font-black">
            Loved by learners.
          </h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="rounded-3xl border border-white/10 bg-black/20 p-6"
              >
                <div className="flex gap-1 text-orange-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      fill="currentColor"
                    />
                  ))}
                </div>

                <p className="mt-5 leading-7 text-white/70">
                  "{review.text}"
                </p>

                <h3 className="mt-6 font-bold">
                  {review.name}
                </h3>

                <p className="text-sm text-white/45">
                  {review.role}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#09090B] px-5 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p className="text-lg font-bold text-orange-400">
            Stack Adda
          </p>

          <p>Learn. Build. Get Placed.</p>

          <p>© {new Date().getFullYear()} Stack Adda. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
