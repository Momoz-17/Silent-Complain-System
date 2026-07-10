import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import ComplaintForm from './components/ComplaintForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import SafetyTips from './components/SafetyTips';
import Transparency from './components/Transparency';
import PublicFeed from './components/PublicFeed';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = "block text-gray-600 hover:text-red-500 font-semibold py-3 border-b border-gray-100 transition-colors duration-200 tracking-wide text-sm";

  return (
    <Router>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
          
          {/* Navigation Bar */}
          <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4 max-w-7xl mx-auto w-full">
              
              <Link to="/" className="hover:opacity-90 transition shrink-0" onClick={closeMenu}>
                <h1 className="font-black text-xl sm:text-2xl text-red-600 tracking-tight uppercase">
                  Complaint System
                </h1>
              </Link>

              {/* Desktop & Tablet Navigation (Switches to Hamburger below 1024px to prevent overlapping) */}
              <div className="hidden lg:flex gap-6 lg:gap-8 font-bold items-center text-xs lg:text-sm tracking-wide uppercase">
                <Link to="/transparency" className="text-gray-600 hover:text-red-500 transition">Track Progress</Link>
                <Link to="/safety-tips" className="text-gray-600 hover:text-red-500 transition">Safety Tips</Link>
                <Link to="/feed" className="text-gray-600 hover:text-red-600 transition">Public Feed</Link>
                {!token && (
                  <Link to="/report" className="text-gray-600 hover:text-red-500 transition">Report Issue</Link>
                )}
                {token ? (
                  <>
                    <Link to="/admin" className="text-red-600 hover:text-red-700 font-extrabold transition">Dashboard</Link>
                    <button 
                      onClick={logout} 
                      className="text-gray-600 hover:text-red-500 border border-gray-300 px-4 py-1.5 rounded-xl text-xs font-bold transition transform active:scale-95"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/admin" className="text-gray-600 hover:text-red-500 transition">Admin Portal</Link>
                )}
              </div>

              {/* Mobile Hamburger Toggle Button */}
              <button
                className="lg:hidden p-2 -mr-2 text-gray-700 hover:text-red-600 focus:outline-none transition"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile Dropdown Menu Container */}
            {menuOpen && (
              <div className="lg:hidden bg-white border-t border-gray-100 px-5 pb-6 pt-2 font-bold uppercase tracking-wide text-xs shadow-inner animate-in slide-in-from-top-4 duration-200">
                <Link to="/transparency" className={navLinkClass} onClick={closeMenu}>Track Progress</Link>
                <Link to="/safety-tips" className={navLinkClass} onClick={closeMenu}>Safety Tips</Link>
                <Link to="/feed" className={navLinkClass} onClick={closeMenu}>Public Feed</Link>
                {!token && (
                  <Link to="/report" className={navLinkClass} onClick={closeMenu}>Report Issue</Link>
                )}
                {token ? (
                  <div className="pt-2">
                    <Link to="/admin" className="block py-3 font-black text-red-600 border-b border-gray-100" onClick={closeMenu}>Dashboard</Link>
                    <button
                      onClick={logout}
                      className="w-full text-center bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-600 font-bold px-4 py-3 rounded-xl mt-4 border border-gray-200 transition transform active:scale-95"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link to="/admin" className={navLinkClass} onClick={closeMenu}>Admin Portal</Link>
                )}
              </div>
            )}
          </nav>

          {/* Core Routes Container */}
          <main className="flex-grow flex flex-col justify-center">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/report" element={<ComplaintForm />} />
              <Route path="/transparency" element={<Transparency />} />
              <Route path="/safety-tips" element={<SafetyTips />} />
              <Route path="/feed" element={<PublicFeed />} />
              <Route
                path="/admin"
                element={token ? <AdminDashboard setToken={setToken} /> : <AdminLogin setToken={setToken} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;