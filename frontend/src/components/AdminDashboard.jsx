import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [complaints, setComplaints] = useState([]);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/complaints/all');
            setComplaints(res.data);
        } catch (err) {
            console.error("Error fetching data", err);
        }
    };

    useEffect(() => { fetchComplaints(); }, []);

    // ... inside AdminDashboard.jsx

    const handleDelete = async (id) => {
        if (window.confirm("Delete this?")) {
            try {
                // Ensure this URL matches the backend router.delete('/:id')
                await axios.delete(`http://localhost:5000/api/complaints/${id}`);
                fetchComplaints(); // Reload list
            } catch (err) {
                console.error("Delete Error:", err.response);
                alert("Could not delete.");
            }
        }
    };

    const handleResolve = async (id) => {
        try {
            // Ensure this URL matches the backend router.put('/resolve/:id')
            await axios.put(`http://localhost:5000/api/complaints/resolve/${id}`);
            fetchComplaints(); // Reload list
        } catch (err) {
            console.error("Resolve Error:", err.response);
            alert("Could not resolve.");
        }
    };

    // Logical Grouping
    const pending = complaints.filter(c => c.status === "Pending");
    const resolved = complaints.filter(c => c.status === "Resolved");

    const ComplaintCard = ({ item, isResolved }) => (
        <div className={`bg-white p-6 rounded-xl shadow-md border-l-8 ${isResolved ? 'border-green-500 bg-green-50/30' : 'border-red-500 shadow-red-100'}`}>
            <div className="flex justify-between items-center mb-4">
                <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isResolved ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.category} {isResolved ? "• SOLVED" : "• ACTIVE"}
                </span>
                <span className="text-gray-400 text-sm font-mono">
                    {new Date(item.createdAt).toLocaleDateString()}
                </span>
            </div>
            
            <p className="text-gray-800 text-lg font-medium mb-4">"{item.description}"</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p><span className="text-gray-400 font-bold block uppercase text-[10px]">Location</span> {item.address}</p>
                <p><span className="text-gray-400 font-bold block uppercase text-[10px]">Contact</span> {item.contact || "Anonymous"}</p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                {!isResolved ? (
                    <button 
                        onClick={() => handleResolve(item._id)} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition"
                    >
                        Mark as Resolved
                    </button>
                ) : (
                    <span className="text-green-600 font-bold flex items-center gap-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        Issue Fixed
                    </span>
                )}
                
                <button 
                    onClick={() => handleDelete(item._id)} 
                    className="text-gray-400 hover:text-red-600 transition p-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Admin Panel</h1>
                        <p className="text-gray-500 font-medium">Manage community reports and transparency.</p>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-bold text-red-600">{pending.length}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Active Alerts</span>
                    </div>
                </header>

                {/* ACTIVE REPORTS SECTION */}
                <section className="mb-16">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        Unsolved Cases
                    </h2>
                    <div className="space-y-6">
                        {pending.length === 0 ? <p className="text-gray-400 italic">Clear skies! No pending issues.</p> : 
                        pending.map(item => <ComplaintCard key={item._id} item={item} isResolved={false} />)}
                    </div>
                </section>

                {/* SOLVED REPORTS SECTION */}
                <section>
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                        Solved Archive
                    </h2>
                    <div className="space-y-6">
                        {resolved.map(item => <ComplaintCard key={item._id} item={item} isResolved={true} />)}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;