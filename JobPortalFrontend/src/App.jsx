import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import JobPortal from './JobPortal.jsx';

function App() {
  

  return (
    <>
    <div>
      {/* <Navbar
              user={user}
              onLogout={handleLogout}
              onLoginClick={() => setShowAuthModal(true)}
              onHomeClick={handleHomeClick}
            /> */}
      <Router>
        <Routes>
          <Route path="/" element={<JobPortal />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path='/register' element ={<Register/>}/> */}
        </Routes>
      </Router>
    </div>
    
    </>
  )
}

export default App
