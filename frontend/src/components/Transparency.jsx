import React, { useEffect, useState } from 'react';
import api from '../api';

const Transparency = () => {
    const [stats, setStats] = useState({ total: 0, resolved: 0 });
    const [recentLogs, setRecentLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/api/complaints/all');
                const complaints = res.data;
                setStats({
                    total: complaints.length,
                    resolved: complaints.filter(c => c.status === "Resolved").length
                });
                setRecentLogs(complaints.filter(c => c.status === "Resolved").slice(0, 5));
            } catch (err) {
                console.error("Transparency Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 md:p-12 transition-all duration-300">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="mb-8 sm:mb-10 text-left relative overflow-hidden p-5 sm:p-6 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 shadow-sm">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                        Transparency Portal
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Real-time updates on community safety, tracking metrics, and anonymous incident resolutions.
                    </p>
                    <div className="absolute right-4 top-4 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </div>
                </div>

                {/* Metrics Stats Grid */}
                <div className="grid sm:grid-cols-2 gap-6 mb-10 sm:mb-12">
                    <div className="group bg-white p-6 sm:p-8 rounded-3xl border border-red-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-red-50 rounded-full group-hover:scale-110 transition-transform duration-500 opacity-60"></div>
                        <span className="text-4xl sm:text-5xl font-black text-red-600 tracking-tight block transition-transform duration-300 group-hover:scale-105">
                            {loading ? "..." : stats.total}
                        </span>
                        <p className="text-red-600/90 font-bold uppercase text-xs tracking-widest mt-3 flex items-center gap-1">
                            Reports Filed
                        </p>
                    </div>

                    <div className="group bg-white p-6 sm:p-8 rounded-3xl border border-green-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-green-50 rounded-full group-hover:scale-110 transition-transform duration-500 opacity-60"></div>
                        <span className="text-4xl sm:text-5xl font-black text-green-600 tracking-tight block transition-transform duration-300 group-hover:scale-105">
                            {loading ? "..." : stats.resolved}
                        </span>
                        <p className="text-green-600/90 font-bold uppercase text-xs tracking-widest mt-3 flex items-center gap-1">
                            Issues Resolved
                        </p>
                    </div>
                </div>

                {/* Recently Resolved Logs Section */}
                <div className="bg-white rounded-3xl p-5 sm:p-6 md:p-8 border border-gray-100 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-8 border-b border-gray-100 pb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Recently Resolved</h2>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 font-semibold rounded-full text-xs">
                            Live Logs
                        </span>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-10 text-gray-400 font-medium animate-pulse">Loading updates...</div>
                        ) : recentLogs.length > 0 ? (
                            recentLogs.map((log) => (
                                <div
                                    key={log._id}
                                    className="flex items-start gap-4 p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-300 group"
                                >
                                    <div className="bg-green-500 text-white p-2.5 rounded-xl shadow-md shadow-green-100 transform group-hover:scale-110 transition-transform shrink-0">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-800 text-base mb-1 transition-colors group-hover:text-green-700">
                                            {log.category} issue resolved
                                        </p>
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                                            <span className="bg-gray-100 px-2.5 py-0.5 rounded-md font-medium text-gray-600 break-words">
                                                📍 {log.address}
                                            </span>
                                            <span>•</span>
                                            <span className="font-medium">
                                                Fixed on {new Date(log.updatedAt || log.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
                                <p className="text-gray-400 italic font-medium">No issues resolved yet in this cycle.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transparency;