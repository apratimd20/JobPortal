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
import JobDetails from './components/JobDetails.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {


  return (
    <>
      <div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {/* <Navbar
              user={user}
              onLogout={handleLogout}
              onLoginClick={() => setShowAuthModal(true)}
              onHomeClick={handleHomeClick}
            /> */}
        <Router>
          <Routes>
            <Route path="/" element={<JobPortal />} />
            <Route path="/job/:id" element={<JobDetails />} />
            {/* <Route path="/login" element={<Login />} />
          <Route path='/register' element ={<Register/>}/> */}
          </Routes>
        </Router>
      </div>

    </>
  )
}

export default App
