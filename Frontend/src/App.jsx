import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './/Pages/Home'

const App = () => {
  return (
    <div ClassName="   bg-black no-scrollbar" >
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
