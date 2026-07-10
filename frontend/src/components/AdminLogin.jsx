import React, { useState } from 'react';
import api from '../api';

const AdminLogin = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const res = await api.post('/api/auth/login', { email, password });
            localStorage.setItem('adminToken', res.data.token);
            setToken(res.data.token);
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[70vh] mt-10 p-4">
            <form onSubmit={handleLogin} className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h2>
                {error && (
                    <div className="mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {error}
                    </div>
                )}
                <div className="space-y-4">
                    <input
                        type="email" placeholder="Admin Email" required
                        value={email}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password" placeholder="Password" required
                        value={password}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        disabled={isLoading}
                        className={`w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2 ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            "Enter Dashboard"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminLogin;