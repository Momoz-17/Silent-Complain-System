import React, { useState } from 'react';
import axios from 'axios';

const AdminLogin = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            localStorage.setItem('adminToken', res.data.token);
            setToken(res.data.token);
        } catch (err) {
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="flex items-center justify-center mt-20 p-4">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
                <div className="space-y-4">
                    <input 
                        type="email" placeholder="Admin Email" required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" placeholder="Password" required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition">
                        Enter Dashboard
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;