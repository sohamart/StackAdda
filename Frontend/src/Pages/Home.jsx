import React from "react";
import { useEffect } from "react";
import Lenis from "lenis";

const Home = () => {

    return (
        <>
        {/* First Screen */}
        <div className="relative h-[92vh] w-full  bg-black overflow-hidden">

            {/* Orange Glow */}
            <div
                className="
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                lg:w-[700px]
                w-[500px]
                h-[500px]
                lg:h-[700px]
                rounded-full
                bg-orange-500/20
                blur-[180px]
                "
            />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-30"
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
                className="absolute right-20 top-28 w-72 h-72 opacity-30"
                style={{
                    backgroundImage:
                        "radial-gradient(#ff6a00 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                }}
            />

            {/* SVG Lines */}
            <svg
                className="absolute inset-0 w-full h-full opacity-40"
                xmlns="http://www.w3.org/2000/svg"
            >
                <line
                    x1="0"
                    y1="120"
                    x2="500"
                    y2="620"
                    stroke="#444"
                    strokeWidth="1"
                />

                <line
                    x1="350"
                    y1="0"
                    x2="900"
                    y2="550"
                    stroke="#333"
                    strokeWidth="1"
                />

                <line
                    x1="100%"
                    y1="80"
                    x2="60%"
                    y2="500"
                    stroke="#333"
                    strokeWidth="1"
                />

                <line
                    x1="70%"
                    y1="0"
                    x2="70%"
                    y2="100%"
                    stroke="#222"
                    strokeWidth="1"
                />

                <line
                    x1="25%"
                    y1="0"
                    x2="25%"
                    y2="100%"
                    stroke="#222"
                    strokeWidth="1"
                />
            </svg>

            {/* Noise */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle,#fff 1px,transparent 1px)",
                    backgroundSize: "8px 8px",
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center  min-h-screen">
                <p className="lg:text-2xl sm:text-sm text-l md:text:xl mt-10 text-orange-500 uppercase mb-4">
                    Learn. Code. Placed.
                </p>
                <h1 className="lg:text-9xl  text-5xl md:text-7xl uppercase font-bold text-white">
                    Stack Adda
                </h1>
                <p className="lg:text-2xl sm:text-sm text-l md:text-xl text-white/50  mt-4 mb-4">
                    Join With Us, Learn and Get Placed in Top MNCs. 
                </p>
                <button
                className="
                    group
                    relative
                    overflow-hidden
                    px-6
                    py-3
                    rounded-xl
                    border
                    mt-5
                    border-orange-500
                    bg-orange-600
                    text-white
                    font-semibold
                    transition-all
                    duration-500
                    active:scale-95
                    hover:bg-orange-500
                    hover:shadow-[0_0_20px_rgba(249,115,22,0.7)]
                    hover:shadow-orange-500/60
                "
                >
                <div className="relative h-6 overflow-hidden">
                    {/* Default Text */}
                    <span
                    className="
                        block
                        transition-transform
                        duration-500
                        group-hover:-translate-y-full
                    "
                    >
                    Get Started
                    </span>

                    {/* Hover Text */}
                    <span
                    className="
                        absolute
                        left-0
                        top-full
                        w-full
                        transition-all
                        duration-500
                        group-hover:top-0
                    "
                    >
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