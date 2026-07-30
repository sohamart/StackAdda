import React, { useRef, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  Code,
  Database,
  Server,
  ArrowRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const courses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    tag: "Most Popular",
    icon: Code,
    desc:
      "Master React, Next.js, Node.js and MongoDB with real-world projects. Build scalable web applications.",
    features: [
      "React & Next.js",
      "Node & Express",
      "MongoDB",
      "System Design",
    ],
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    tag: "Placement",
    icon: Database,
    desc:
      "Prepare for product companies with structured DSA. Crack top interviews with rigorous practice.",
    features: [
      "Trees & Graphs",
      "Dynamic Programming",
      "Arrays & Strings",
      "Interview Prep",
    ],
  },
  {
    id: 3,
    title: "Backend Masterclass",
    tag: "Advanced",
    icon: Server,
    desc:
      "Deep dive into Docker, Redis, AWS, Scaling and Microservices for highly scalable architectures.",
    features: [
      "Docker & K8s",
      "Redis & Kafka",
      "AWS Deployment",
      "Microservices",
    ],
  },
];

export default function StructuredCourses() {
  const isMobileView = 
    (typeof navigator !== "undefined" && navigator.userAgent.includes("StackAddaMobileApp")) || 
    (typeof window !== "undefined" && window.innerWidth < 1024);

  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const cardsRef = useRef([]);
  const overlaysRef = useRef([]);

  cardsRef.current = [];
  overlaysRef.current = [];

  const addCard = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  const addOverlay = (el) => {
    if (el && !overlaysRef.current.includes(el)) {
      overlaysRef.current.push(el);
    }
  };

  useLayoutEffect(() => {
    if (isMobileView) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current;
      const overlays = overlaysRef.current;

      // Initial state
      cards.forEach((card, index) => {
        gsap.set(card, {
          yPercent: index === 0 ? 0 : 150, // Start lower to prevent seeing it early
          scale: 1,
          opacity: 1,
          zIndex: index, // New cards need a higher zIndex to slide on TOP of previous ones
          transformOrigin: "top center",
        });
        
        if (overlays[index]) {
          gsap.set(overlays[index], { opacity: 0 });
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${cards.length * 100}%`,
          pin: pinRef.current,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      cards.forEach((card, index) => {
        if (index === 0) return;

        // The time label for this card's animation phase
        const label = `card${index}`;
        tl.addLabel(label);

        // New card comes from bottom
        tl.to(
          card,
          {
            yPercent: 0,
            duration: 1,
            ease: "none",
          },
          label
        );

        // All previous cards scale down and get darker
        for (let j = 0; j < index; j++) {
          tl.to(
            cards[j],
            {
              scale: 1 - ((index - j) * 0.05), // 0.95, 0.90, etc.
              y: (index - j) * -20, // slight move up
              duration: 1,
              ease: "none",
            },
            label
          );

          if (overlays[j]) {
            tl.to(
              overlays[j],
              {
                opacity: (index - j) * 0.5, // Dimming effect using opacity (GPU accelerated, no lag!)
                duration: 1,
                ease: "none",
              },
              label
            );
          }
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-black"
      style={{
        height: isMobileView ? "auto" : `${(courses.length + 1) * 100}vh`,
      }}
    >
      {/* Pinned Section */}
      <div
        ref={pinRef}
        className={isMobileView 
          ? "relative py-16 flex flex-col items-center justify-start w-full px-4 overflow-hidden" 
          : "sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-start pt-16 md:pt-24 w-full px-4"}
      >
        {/* Subtle background element (not too glowing) */}
        <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[300px] bg-orange-500/5 blur-3xl pointer-events-none rounded-full" />

        {/* Heading Layer - In document flow, won't get covered */}
        <div className="text-center z-0 w-full flex-shrink-0">
          <p className="uppercase tracking-[.25em] text-orange-500 font-bold text-[10px] md:text-xs mb-3">
            Premium Content
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
            Structured Courses.
          </h2>
        </div>

        {/* Cards Container - Takes up remaining space */}
        <div className={isMobileView 
          ? "relative w-full flex flex-col gap-6 items-center justify-center mt-6 mb-8 z-10 max-w-5xl"
          : "relative w-full flex-1 max-w-5xl flex items-center justify-center mt-6 sm:mt-10 mb-8 z-10"}>
          {courses.map((course) => {
            const Icon = course.icon;

            return (
              <div
                key={course.id}
                ref={addCard}
                className={isMobileView
                  ? "relative w-full h-auto flex items-center justify-center sm:px-0"
                  : "absolute w-full h-full max-h-[600px] flex items-center justify-center px-2 sm:px-0"}
              >
                {/* Premium Modern Card */}
                <div
                  className="
                    relative w-full h-full max-h-[550px]
                    rounded-[2rem] md:rounded-[2.5rem]
                    bg-[#0c0c0c]
                    border border-white/10
                    shadow-2xl
                    overflow-hidden
                    flex flex-col
                  "
                >
                  {/* Subtle top edge highlight */}
                  <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

                  {/* Dark Overlay for Depth (Animated by GSAP) */}
                  <div 
                    ref={addOverlay}
                    className="absolute inset-0 bg-black pointer-events-none z-50 rounded-[inherit]"
                  />

                  <div className="relative z-10 p-6 sm:p-8 md:p-12 flex flex-col justify-between h-full">
                    
                    {/* TOP HALF */}
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                      <div className="flex flex-col gap-3 md:gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                          <Icon className="text-orange-500 w-6 h-6 md:w-8 md:h-8" />
                        </div>
                        <h3 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mt-2 leading-tight md:max-w-2xl">
                          {course.title}
                        </h3>
                        <p className="text-zinc-400 mt-1 md:mt-2 text-sm sm:text-base md:text-lg max-w-xl font-medium leading-relaxed">
                          {course.desc}
                        </p>
                      </div>

                      <div className="hidden md:flex shrink-0 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 h-fit">
                        <span className="uppercase tracking-widest text-[10px] font-bold text-zinc-300">
                          {course.tag}
                        </span>
                      </div>
                    </div>

                    {/* BOTTOM HALF */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-10 mt-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 md:gap-x-12 gap-y-3 w-full sm:w-auto">
                        {course.features.map((item) => (
                          <div
                            key={item}
                            className="flex items-center gap-3 text-zinc-300 font-medium text-xs sm:text-sm"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>

                      <Link
                        to="/courses"
                        className="w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-orange-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors duration-300 shrink-0 group"
                      >
                        Explore Course
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}