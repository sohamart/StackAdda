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
  const isMobileView = 
    (typeof navigator !== "undefined" && navigator.userAgent.includes("StackAddaMobileApp")) || 
    (typeof window !== "undefined" && window.innerWidth < 768);

  const sectionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useLayoutEffect(() => {
    // Only completely disable for the WebView if it's strictly a Web Wrapper requirement,
    // but user wants horizontal scroll everywhere. Let's just run GSAP for all.
    // If they explicitly wanted the mobile app to be a vertical list, they wouldn't have asked to center the slider on mobile.
    if (typeof navigator !== "undefined" && navigator.userAgent.includes("StackAddaMobileApp")) {
       // Keep it disabled ONLY for the mobile app webview if it causes the previous overlap bug,
       // wait, the previous bug was vertical overlap pinning. Horizontal pinning might work! 
       // But to be safe, if they want mobile horizontal scroll, let's enable it for everything.
    }

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
      className={`relative bg-black h-[100dvh] overflow-hidden`}
    >
      {/* Background glow */}
      <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[300px] bg-orange-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Main Container */}
      <div className={`flex flex-col h-full w-full pt-16 md:pt-24`}>
        
        {/* Sticky Heading */}
        <div className={`text-center z-10 w-full flex-shrink-0 px-4`}>
          <p className="uppercase tracking-[.25em] text-orange-500 font-bold text-xs sm:text-sm mb-3">
            Premium Content
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight">
            Structured Courses.
          </h2>
        </div>

        {/* Courses Container */}
        <div className={`flex-1 w-full flex items-center overflow-hidden mt-8`}>
          <div
            ref={scrollContainerRef}
            className={`flex flex-row flex-nowrap w-max gap-6 md:gap-10`}
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
                  className={`w-[90vw] md:w-[70vw] max-w-[900px] shrink-0`}
                >
                  {/* Premium Modern Card */}
                  <div
                    className={`
                      relative w-full
                      h-auto min-h-[450px] md:h-[550px]
                      rounded-[2rem] md:rounded-[2.5rem]
                      bg-[#0c0c0c]
                      border border-white/10
                      shadow-2xl
                      overflow-hidden
                      flex flex-col
                    `}
                  >
                    {/* Subtle top edge highlight */}
                    <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

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
      </div>
    </section>
  );
}