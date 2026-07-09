import React from "react";
import YoutubeSection from "../Components/HomeComponents/YoutubeSection";
import Courses from "../Components/HomeComponents/Courses";
import HeroSection from "../Components/HomeComponents/HeroSection";
import API from "../api/axios";
import { useEffect } from "react";



const Home = () => {
  useEffect(() => {
    API.get("/auth/me")
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err.response?.data));
  }, []);

  return (
    <>

      {/* First Screen */}
      <div className="relative lg:h-[89vh] h-[70vh] w-full overflow-hidden bg-black  sm:px-8 lg:px-16">

        <HeroSection />
        
      </div>


      {/* Second Screen */}
      <div className="relative  w-full rounded-t-[60px] lg:rounded-t-[120px] border-t border-white/20 bg-black overflow-hidden">
       
        <YoutubeSection />
      
      </div>

      {/* Third Screen */}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl text-center uppercase text-white font-bold">
          Our Courses
        </h1>

        {/* Courses */}
        <Courses />


        {/* Button */}
        <div className="flex justify-center mt-5">
          <button
            className="
                      rounded-xl
                      border
                      border-orange-500/50
                      bg-orange-500/20
                      px-8
                      py-4
                      font-semibold
                      text-white
                      transition
                      hover:bg-orange-500
                      hover:shadow-[0_0_25px_rgba(249,115,22,.6)]
                      active:scale-95
                      mb-12
                      mt-8
                      
                    ">
                      
            View All Courses →
          </button>
        </div>


      </div>
    </>
  );
};

export default Home;