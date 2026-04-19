// frontend/client/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Schedule from './components/Schedule';

// Top level component
function App() {
  const [showContact, setShowContact] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* Navigation Bar */}
        <nav className="navbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src="/ju_logo.png" alt="JU Logo" style={{ height: '100px' }} />
            <h1>SpaceSync</h1>
          </div>
          <div className="nav-links">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Dashboard
            </NavLink>
            <NavLink to="/schedule" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Schedules
            </NavLink>
            <button 
              className="nav-link" 
              style={{ background: 'transparent', cursor: 'pointer', border: 'none', fontSize: '1rem' }} 
              onClick={() => setShowContact(true)}>
              Contact Us
            </button>
          </div>
        </nav>

        {/* Setting up our routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>

        {/* Footer Section */}
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} SpaceSync. Developed by TEAM L.</p>
        </footer>

        {/* Contact Modal */}
        {showContact && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', 
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}>
            <div className="card" style={{ width: '350px', textAlign: 'center' }}>
              <h2>Contact Support</h2>
              <p style={{ marginTop: '1.5rem', color: '#1E293B', fontWeight: 'bold', fontSize: '1.2rem' }}>+8801999575000</p>
              <p style={{ marginTop: '0.5rem', color: '#1E293B', fontWeight: 'bold' }}>shadman.rahman@gmail.com</p>
              <button className="btn-primary" style={{ marginTop: '2rem' }} onClick={() => setShowContact(false)}>Close</button>
            </div>
          </div>
        )}

      </div>
    </BrowserRouter>
  );
}

export default App;
