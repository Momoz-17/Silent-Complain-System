import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ComplaintForm from './components/ComplaintForm';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';

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
          <h1 className="font-bold text-2xl text-red-600 tracking-tight">Community Connect</h1>
          <div className="flex gap-8 font-medium items-center">
            {/* HIDE Report Issue if admin is logged in */}
            {!token && (
              <Link to="/" className="hover:text-red-500 transition">Report Issue</Link>
            )}
            
            {token ? (
              <>
                <Link to="/admin" className="hover:text-red-500 transition font-bold text-red-600">Dashboard</Link>
                <button onClick={logout} className="text-gray-600 hover:text-red-500 border px-3 py-1 rounded-lg">Logout</button>
              </>
            ) : (
              <Link to="/admin" className="text-gray-600 hover:text-red-500">Admin Portal</Link>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<ComplaintForm />} />
          <Route path="/admin" element={
            token ? <AdminDashboard /> : <AdminLogin setToken={setToken} />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;