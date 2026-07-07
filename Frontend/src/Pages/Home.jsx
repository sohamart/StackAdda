import React from "react";
import { useEffect } from "react";
import Lenis from "lenis";


const Home = () => {
    
    return (
        <>

        {/* First Screen */}
        <div className="relative lg:h-[92vh] h-[85vh] w-full overflow-hidden bg-black px-5 sm:px-8 lg:px-16">
        
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
        lg:bg-orange-500/20
        bg-orange-500/30
        blur-[120px]
        lg:blur-[180px]
        "
    />

    {/* Grid */}
    <div
        className="absolute inset-0 opacity-25"
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
        className="absolute right-6 hidden lg:block  top-20 sm:right-12 lg:right-20 w-40 h-40 sm:w-60 sm:h-60 lg:w-72 lg:h-72 lg:opacity-20"
        style={{
            backgroundImage:
                "radial-gradient(#ff6a00 1px, transparent 1px)",
            backgroundSize: "18px 18px",
        }}
    />

    {/* SVG */}
    <svg
        className="absolute lg:block hidden inset-0 w-full h-full opacity-20"
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

                <span className="block uppercase transition-transform duration-500 group-hover:-translate-y-full">
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
                <div className="relative  flex flex-col items-center justify-center  w-120 h-120 ">

                </div>
        </div>
    </>
    );
};

export default Home;