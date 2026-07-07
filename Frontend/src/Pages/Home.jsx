import React from "react";
import { useEffect } from "react";
import Lenis from "lenis";
import YTlogo from "../assets/YTlogo.png";
import Intro from "../assets/intro.mp4";



const Home = () => {
    
    return (
        <>

        {/* First Screen */}
        <div className="relative lg:h-[89vh] h-[70vh] w-full overflow-hidden bg-black  sm:px-8 lg:px-16">
        
    {/* Orange Glow */}
    <div
        className="
        absolute
        left-1/2
        top-1/2
        -translate-x-1/2
        -translate-y-1/2
        w-[320px]
        h-[320px]
        sm:w-[500px]
        sm:h-[500px]
        lg:w-[600px]
        lg:h-[700px]
        rounded-full
        lg:bg-orange-500/25
        bg-orange-500/25
        blur-[120px]
        lg:blur-[180px]
        
        
        "
    />

    {/* Grid */}
    <div
        className="absolute inset-0 lg:opacity-40 opacity-45"
        style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
        }}
    />

    {/* Dot Pattern */}
    <div
        className="absolute right-6 hidden lg:block  top-20 sm:right-12 lg:right-20 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 opacity-40"
        style={{
            backgroundImage:
                "radial-gradient(#ff6a00 1px, transparent 1px)",
            backgroundSize: "18px 18px",
        }}
    />

    {/* SVG */}
    <svg
        className="absolute lg:block hidden  inset-0 w-full h-full opacity-40"
        xmlns="http://www.w3.org/2000/svg"
    >
        <line x1="0" y1="120" x2="500" y2="620" stroke="#444" />
        <line x1="350" y1="0" x2="900" y2="550" stroke="#333" />
        <line x1="100%" y1="80" x2="60%" y2="500" stroke="#333" />
        <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#222" />
        <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#222" />
    </svg>

    {/* Noise */}
    <div
        className="absolute lg:block  inset-0 opacity-[0.03]"
        style={{
            backgroundImage:
                "radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize: "8px 8px",
        }}
    />

    {/* Content */}
    <div className="relative lg:mt-0 mt-[-60px] z-10 flex min-h-screen flex-col items-center justify-center text-center">

        <p className="text-xs sm:text-sm md:text-lg lg:text-2xl uppercase tracking-[4px] text-orange-500">
            Learn. Code. Placed.
        </p>

        <h1
            className="
            mt-4
            font-extrabold
            uppercase
            text-white
            leading-none
            text-5xl
            sm:text-6xl
            md:text-7xl
            lg:text-9xl
            "
        >
            Stack Adda
        </h1>

        <p
            className="
            mt-5
            max-w-[90%]
            sm:max-w-xl
            lg:max-w-3xl
            text-sm
            sm:text-base
            md:text-lg
            lg:text-2xl
            text-white/60
            leading-relaxed
            "
        >
            Join With Us, Learn and Get Placed in Top MNCs.
        </p>

        <button
            className="
            group
            relative
            mt-8
            overflow-hidden
            rounded-xl
            border
            border-orange-500
            bg-orange-600
            px-8
            py-3
            sm:px-10
            sm:py-4
            text-sm
            sm:text-base
            font-semibold
            text-white
            transition-all
            duration-500
            hover:bg-orange-500
            hover:shadow-[0_0_25px_rgba(249,115,22,.8)]
            active:scale-95
            "
        >
            <div className="relative h-6 overflow-hidden">

                <span className="block uppercase  transition-transform duration-500 group-hover:-translate-y-full">
                    Get Started
                </span>

                <span className="absolute uppercase left-0 top-full w-full transition-all duration-500 group-hover:top-0">
                    Let's Go →
                </span>

            </div>
        </button>

    </div>

</div>
       
        {/* Second Screen */}
<div className="relative min-h-screen w-full rounded-t-[60px] lg:rounded-t-[120px] border-t border-white/20 bg-black overflow-hidden">

  <div className="mx-auto flex w-full max-w-7xl justify-center px-4 sm:px-6 lg:px-10 py-8 lg:py-14">

    <div
      className="
      group
      relative
      w-full
      overflow-hidden
      rounded-[28px]
      lg:rounded-[40px]
      border
      border-orange-400/20
      bg-white/[0.04]
      backdrop-blur-3xl
      transition-all
      duration-500
      hover:border-orange-400/40
      hover:shadow-[0_0_80px_rgba(249,115,22,.15)]
      "
    >

      {/* Orange Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-orange-500/20 blur-[120px]" />

      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-orange-300/10 blur-[120px]" />

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-orange-500/10" />

      {/* Shine */}
      <div className="absolute -left-40 top-0 h-full w-24 rotate-12 bg-white/10 blur-xl transition-all duration-1000 group-hover:left-[120%]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-14 p-5 sm:p-8 lg:p-14">

        {/* Left */}
        <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left">

          <div className="flex flex-col sm:flex-row items-center gap-5">

            <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5">

              <img
                src={YTlogo}
                alt="Stack Adda"
                className="h-full w-full object-cover"
              />

            </div>

            <div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Stack Adda
              </h2>

              <p className="mt-2 text-sm md:text-base text-orange-400">
                Learn • Build • Get Placed
              </p>

            </div>

          </div>

          <p className="mt-8 max-w-xl text-sm sm:text-base lg:text-lg leading-8 text-white/60">

            Subscribe to our YouTube channel and become part of our growing developer community. Learn Web Development, DSA, AI and crack your dream placement.

          </p>

          <div className="mt-8 flex w-full flex-col sm:flex-row gap-4">

            <button
              className="
              w-full sm:w-auto
              rounded-xl
              border
              border-red-500
              bg-red-500
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-red-600
              active:scale-95
              "
            >
              Subscribe
            </button>

            <button
              className="
              w-full sm:w-auto
              rounded-xl
              border
              border-white/20
              bg-white/5
              px-6
              py-3
              text-white
              transition
              hover:border-orange-400
              hover:bg-orange-500/10
              active:scale-95
              "
            >
              Join Community
            </button>

          </div>

        </div>

        {/* Right */}
        <div className="flex-1 w-full max-w-xl lg:max-w-none">

          <div className="relative overflow-hidden rounded-3xl border border-white/10">

            <video
              className="h-[220px] sm:h-[280px] md:h-[350px] lg:h-[380px] w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={Intro} type="video/mp4" />
            </video>

            {/* Top Gradient */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />

            {/* Bottom Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black via-black/40 to-transparent" />

            {/* Left Gradient */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/30 to-transparent" />

            {/* Right Gradient */}
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/30 to-transparent" />

            {/* Orange Glow */}
            <div className="absolute bottom-0 left-1/2 h-24 w-72 -translate-x-1/2 rounded-full bg-orange-500/20 blur-[60px]" />

            {/* Button */}
            <button
              className="
              absolute
              bottom-5
              left-5
              rounded-xl
              border
              border-orange-500/40
              bg-black/40
              px-6
              py-3
              text-white
              backdrop-blur-md
              transition
              duration-300
              hover:bg-orange-500
              hover:border-orange-400
              hover:shadow-[0_0_25px_rgba(249,115,22,.45)]
              active:scale-95
              "
            >
              Get In Touch →
            </button>

          </div>

        </div>

      </div>

    </div>

  </div>

</div>
</>
    );
};

export default Home;