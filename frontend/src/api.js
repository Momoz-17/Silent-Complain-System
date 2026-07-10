import axios from 'axios';

// Centralized API base URL.
// In production, set VITE_API_URL in your .env file (e.g. VITE_API_URL=https://your-backend.onrender.com)
// Falls back to localhost for local development.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Automatically attach the admin JWT (if present) to every outgoing request.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Globally handle expired/invalid admin sessions instead of letting every
// component silently fail with a raw 401.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('adminToken');
            // Force back to the login screen if we were on an admin page.
            if (window.location.pathname.startsWith('/admin')) {
                window.location.href = '/admin';
            }
        }
        return Promise.reject(error);
    }
);

export default api;