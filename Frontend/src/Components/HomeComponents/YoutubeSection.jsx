import React from 'react'
import YTlogo from "../../assets/YTlogo.png";
import Intro from "../../assets/intro.mp4";

const YoutubeSection = () => {

    
  const ytopen = () => {
    window.open("https://yt.openinapp.co/StackAdda", "_blank");
  }
  return (
    <>
     <div className="mx-auto flex w-full  max-w-7xl justify-center px-4 sm:px-6 lg:px-10 py-8 lg:py-14">

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

                  <div className="flex lg:h-26 lg:w-26 w-40 h-40 md:h-20 md:w-20 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-white/5">

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
                  onClick={ytopen}
                    className="
              w-full sm:w-auto
              rounded-xl
              border
              border-red-500
              bg-red-600
              px-6
              py-3
              font-semibold
              text-white
              transition
              hover:bg-black
              hover:border-red-200
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

    </>
  )
}

export default YoutubeSection
