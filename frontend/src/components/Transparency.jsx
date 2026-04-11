import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Transparency = () => {
    const [stats, setStats] = useState({ total: 0, resolved: 0 });
    const [recentLogs, setRecentLogs] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // UPDATED URL TO RENDER WITH FULL ROUTE PATH
                const res = await axios.get('https://silent-complain-system.onrender.com/api/complaints/all');
                const complaints = res.data;
                setStats({
                    total: complaints.length,
                    resolved: complaints.filter(c => c.status === "Resolved").length
                });
                setRecentLogs(complaints.filter(c => c.status === "Resolved").slice(0, 5));
            } catch (err) { 
                console.error("Transparency Fetch Error:", err); 
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Transparency Portal</h1>
                <p className="text-gray-500 mb-10">Real-time updates on community safety and resolutions.</p>

                <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                        <span className="text-4xl font-black text-red-600">{stats.total}</span>
                        <p className="text-red-700 font-medium uppercase text-xs tracking-wider mt-2">Reports Filed</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                        <span className="text-4xl font-black text-green-600">{stats.resolved}</span>
                        <p className="text-green-700 font-medium uppercase text-xs tracking-wider mt-2">Issues Resolved</p>
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-6">Recently Resolved</h2>
                <div className="space-y-4">
                    {recentLogs.length > 0 ? recentLogs.map(log => (
                        <div key={log._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="bg-green-500 text-white p-2 rounded-full">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{log.category} issue resolved</p>
                                <p className="text-sm text-gray-500">Location: {log.address} • Fixed on {new Date(log.updatedAt || log.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-400 italic">No issues resolved yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transparency;