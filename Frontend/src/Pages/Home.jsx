import React from "react";
import { useEffect } from "react";
import Lenis from "lenis";
import YTlogo from "../assets/YTlogo.png";


const Home = () => {
    
    return (
        <>

        {/* First Screen */}
        <div className="relative lg:h-[91vh] h-[80vh] w-full overflow-hidden bg-black px-5 sm:px-8 lg:px-16">
        
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
        lg:w-[700px]
        lg:h-[700px]
        rounded-full
        lg:bg-orange-500/25
        bg-orange-500/30
        blur-[120px]
        lg:blur-[180px]
        "
    />

    {/* Grid */}
    <div
        className="absolute inset-0 lg:opacity-40 opacity-25"
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
        className="absolute lg:block hidden inset-0 w-full h-full opacity-40"
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
        className="absolute lg:block hidden inset-0 opacity-[0.03]"
        style={{
            backgroundImage:
                "radial-gradient(circle,#fff 1px,transparent 1px)",
            backgroundSize: "8px 8px",
        }}
    />

    {/* Content */}
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center text-center">

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
        <div className="relative min-h-screen rounded-t-[100px] w-full border-t border-white/30 bg-black overflow-hidden" >
                <div className="flex  justify-center px-5 py-10">

  <div
    className="
    group
    relative
    w-250
    max-w-7xl
    h-[350px]
    md:h-[450px]
    lg:h-[500px]
    rounded-[40px]
    overflow-hidden
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

    {/* Gradient Glow */}
    <div
      className="
      absolute
      -top-40
      -left-40
      w-96
      h-96
      rounded-full
      bg-orange-500/20
      blur-[120px]
      group-hover:scale-125
      transition-all
      duration-700
      "
    />

    <div
      className="
      absolute
      -bottom-40
      -right-40
      w-96
      h-96
      rounded-full
      bg-orange-300/10
      blur-[120px]
      group-hover:scale-125
      transition-all
      duration-700
      "
    />

    {/* Gradient Overlay */}

    <div
      className="
      absolute
      inset-0
      bg-gradient-to-br
      from-white/5
      via-transparent
      to-orange-500/10
      "
    />

    

    {/* Shine */}

    <div
      className="
      absolute
      -left-40
      top-0
      h-full
      w-24
      rotate-12
      bg-white/10
      blur-xl
      group-hover:left-[120%]
      duration-1000
      "
    />

    {/* Content */}

    <div className="relative z-10 flex h-full flex-col lg:flex-row items-center justify-between gap-10 p-6 md:p-10 lg:p-14">

    {/* Left */}
    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">

        {/* Logo */}
        <div className="flex items-center gap-4">

            <div className= "w-16 h-16 md:w-20 md:h-20 rounded-full border overflow-hidden border-white/20 bg-white/5 flex items-center justify-center">
                <img
                src={YTlogo}
                alt="Stack Adda"
                className=""
            />
            </div>
            

            <div>

                <h2 className="text-3xl md:text-5xl font-bold text-white">
                    Stack Adda
                </h2>

                <p className="text-orange-400 text-sm md:text-base">
                    Learn • Build • Get Placed
                </p>

            </div>

        </div>

        <p className="mt-8 text-white/60 max-w-xl leading-8 text-base md:text-lg">
            Subscribe to our YouTube channel and become part of our growing
            developer community. Learn Web Development, DSA and crack your
            dream placement.
        </p>

        {/* Buttons */}

        <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">

            <button className="rounded-xl bg-red-500 px-6 py-3 border border-white/20 active:scale-95 text-white font-semibold hover:bg-black transition">
                Subscribe
            </button>

            <button className="rounded-xl border active:scale-95 border-white/20 bg-white/5 px-6 py-3 text-white hover:border-orange-400 transition">
                Join Community
            </button>

            

        </div>

    </div>

    {/* Right */}

    <div className="flex-1 w-full">

        <div className=" relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">

            <video
                className="w-full h-[220px] md:h-[350px] object-cover"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src="/intro.mp4" type="video/mp4" />
            </video>
            <button className="rounded-xl active:scale-95 border absolute bottom-5 left-5 bg-white/5 z-20 border-orange-500/40 px-6 py-3 text-orange-400 hover:bg-orange-500 hover:text-white transition">
                Get In Touch
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