import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  Code,
  Database,
  Server,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const courses = [
  {
    id: 1,
    title: "Full Stack Web Development",
    tag: "Most Popular",
    icon: Code,
    desc: "Master React, Next.js, Node.js and MongoDB with real-world projects. Build scalable web applications.",
    features: ["React & Next.js", "Node & Express", "MongoDB", "System Design"],
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    tag: "Placement",
    icon: Database,
    desc: "Prepare for product companies with structured DSA. Crack top interviews with rigorous practice.",
    features: ["Trees & Graphs", "Dynamic Programming", "Arrays & Strings", "Interview Prep"],
  },
  {
    id: 3,
    title: "Backend Masterclass",
    tag: "Advanced",
    icon: Server,
    desc: "Deep dive into Docker, Redis, AWS, Scaling and Microservices for highly scalable architectures.",
    features: ["Docker & K8s", "Redis & Kafka", "AWS Deployment", "Microservices"],
  },
];

export default function StructuredCourses() {
  const [isMobileView, setIsMobileView] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  useLayoutEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);

  const scrollMobile = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth * 0.8; // Scroll by roughly one card width
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  useLayoutEffect(() => {
    if (isMobileView) return;

    const ctx = gsap.context(() => {
      const scrollWidth = scrollContainerRef.current.scrollWidth;
      const amountToScroll = scrollWidth - window.innerWidth;

      gsap.to(scrollContainerRef.current, {
        x: -amountToScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${amountToScroll}`, // Pin for the exact duration of the horizontal scroll
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobileView]);

  return (
    <section
      ref={sectionRef}
      className={`relative bg-black min-h-[100dvh] flex flex-col justify-center overflow-hidden py-16 lg:py-0`}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* Background glow */}
      <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[300px] bg-orange-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className={`flex flex-col w-full ${isMobileView ? "" : "pt-8 md:pt-12"}`}>
        
        {/* Sticky Heading */}
        <div className={`text-center z-10 w-full flex-shrink-0 px-4 ${isMobileView ? "mb-10" : ""}`}>
          <p className="uppercase tracking-[.25em] text-orange-500 font-bold text-xs sm:text-sm mb-3">
            Premium Content
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight">
            Structured Courses.
          </h2>
        </div>

        {/* Courses Container */}
        <div className={`relative flex-1 w-full flex mt-8 overflow-hidden group`}>
          
          {/* Mobile Arrows */}
          {isMobileView && (
            <>
              <button 
                onClick={() => scrollMobile("left")}
                className="absolute left-2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
                aria-label="Previous Course"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={() => scrollMobile("right")}
                className="absolute right-2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-95 transition-transform"
                aria-label="Next Course"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div
            ref={scrollContainerRef}
            className={`flex flex-row flex-nowrap items-stretch gap-6 md:gap-10 ${
              isMobileView 
                ? "w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8" 
                : "w-max"
            }`}
            style={{
              paddingLeft: isMobileView ? "5vw" : "calc(50vw - min(35vw, 450px))",
              paddingRight: isMobileView ? "5vw" : "calc(50vw - min(35vw, 450px))",
            }}
          >
            {courses.map((course) => {
              const Icon = course.icon;
              return (
                <div
                  key={course.id}
                  className={`w-[90vw] md:w-[70vw] max-w-[900px] shrink-0 h-full ${isMobileView ? "snap-center" : ""}`}
                >
                  {/* Premium Modern Card */}
                  <div
                    className={`
                      relative w-full
                      h-full min-h-[400px]
                      rounded-[2rem] md:rounded-[2.5rem]
                      bg-[#0c0c0c]
                      border border-white/10
                      shadow-[0_0_30px_rgba(255,255,255,0.03)]
                      hover:shadow-[0_0_50px_rgba(249,115,22,0.12)]
                      hover:border-orange-500/20
                      transition-all duration-500
                      overflow-hidden
                      flex flex-col
                    `}
                  >
                    {/* Subtle top edge highlight */}
                    <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-orange-500/30 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col justify-between h-full">
                      
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
      </div>
    </section>
  );
}