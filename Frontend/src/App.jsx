import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './/Pages/Home'
import { useEffect } from "react";
import Lenis from "lenis";

const App = () => {
   useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);
  return (
    <div ClassName="   bg-black no-scrollbar" >
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
