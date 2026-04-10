import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home'; // New Import
import ComplaintForm from './components/ComplaintForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import SafetyTips from './components/SafetyTips';
import Transparency from './components/Transparency';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <nav className="bg-white shadow-md p-4 flex justify-between px-10 items-center">
          <Link to="/" className="hover:opacity-80 transition">
            <h1 className="font-bold text-2xl text-red-600 tracking-tight">Silent Complaint</h1>
          </Link>

          <div className="flex gap-8 font-medium items-center">
            <Link to="/transparency" className="hover:text-red-500 transition text-gray-600">Track Progress</Link>
            <Link to="/safety-tips" className="hover:text-red-500 transition">Safety Tips</Link>

            {/* Link to the new /report page */}
            {!token && (
              <Link to="/report" className="hover:text-red-500 transition">Report Issue</Link>
            )}
            
            {token ? (
              <>
                <Link to="/admin" className="hover:text-red-500 transition font-bold text-red-600">Dashboard</Link>
                <button onClick={logout} className="text-gray-600 hover:text-red-500 border border-gray-300 px-4 py-1 rounded-lg">Logout</button>
              </>
            ) : (
              <Link to="/admin" className="text-gray-600 hover:text-red-500">Admin Portal</Link>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ComplaintForm />} />
          <Route path="/transparency" element={<Transparency />} />
          <Route path="/safety-tips" element={<SafetyTips />} />
          <Route path="/admin" element={token ? <AdminDashboard /> : <AdminLogin setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;