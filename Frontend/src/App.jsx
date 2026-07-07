import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './/Pages/Home'
import { useEffect } from "react";
import Lenis from "lenis";

import MainLayout from './/Layout/MainLayout'

const App = () => {
  useEffect(() => {
  const lenis = new Lenis({
    duration: 1.4,
    smoothWheel: true,
    syncTouch: true,       // Mobile support
    syncTouchLerp: 0.08,
    touchMultiplier: 1.2,
    wheelMultiplier: 1,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return () => {
    lenis.destroy();
  };
}, []);
  return (
    <div className=" flex flex-col w-full   bg-black no-scrollbar" >

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
