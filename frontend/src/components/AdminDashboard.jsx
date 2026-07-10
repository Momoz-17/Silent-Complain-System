import React, { useEffect, useState } from 'react';
import api, { API_BASE_URL } from '../api';

const AdminDashboard = ({ setToken }) => {
    const [complaints, setComplaints] = useState([]);
    const [activeTab, setActiveTab] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null); // disables buttons on the card currently being updated

    const fetchComplaints = async () => {
        try {
            const res = await api.get('/api/complaints/all');
            setComplaints(res.data);
        } catch (err) {
            console.error("Error fetching data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const logout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this report?")) return;
        setBusyId(id);
        try {
            await api.delete(`/api/complaints/${id}`);
            setComplaints(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            console.error("Delete Error:", err.response);
            alert("Could not complete delete operational action.");
        } finally {
            setBusyId(null);
        }
    };

    const handleResolve = async (id) => {
        setBusyId(id);
        try {
            await api.put(`/api/complaints/resolve/${id}`);
            setComplaints(prev => prev.map(c => c._id === id ? { ...c, status: "Resolved" } : c));
        } catch (err) {
            console.error("Resolve Error:", err.response);
            alert("Could not mark issue as resolved.");
        } finally {
            setBusyId(null);
        }
    };

    const pending = complaints
        .filter(c => c.status === "Pending")
        .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));

    const resolved = complaints.filter(c => c.status === "Resolved");

    const ComplaintCard = ({ item, isResolved }) => {
        const hasHighUrgency = !isResolved && item.upvotes >= 5;
        const isBusy = busyId === item._id;

        return (
            <div className={`bg-white rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md 
                ${isResolved ? 'border-green-100 hover:border-green-200' :
                    hasHighUrgency ? 'border-orange-300 ring-2 ring-orange-500/10 hover:border-orange-400' : 'border-red-100 hover:border-red-200'}`}
            >
                <div className="p-5 sm:p-6 md:p-8">
                    {/* Meta Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isResolved ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {item.category} {isResolved ? "• Resolved" : "• Active Alert"}
                            </span>

                            {!isResolved && (item.upvotes > 0) && (
                                <span className={`px-2.5 py-1 rounded-md font-extrabold text-xs flex items-center gap-1.5 transition-all
                                    ${hasHighUrgency
                                        ? 'bg-orange-600 text-white animate-pulse'
                                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                                    }`}
                                >
                                    {hasHighUrgency ? '🔥 High Priority •' : '🔺'} {item.upvotes} {item.upvotes === 1 ? 'user' : 'users'} affected
                                </span>
                            )}
                        </div>

                        <span className="text-gray-400 text-xs font-semibold bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                            🗓️ {new Date(item.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                    </div>

                    {/* Description Body Statement */}
                    <p className="text-gray-800 text-base sm:text-lg font-medium leading-relaxed mb-6 break-words">
                        "{item.description}"
                    </p>

                    {/* Evidence preview, if any */}
                    {item.evidence && (
                        <a 
                            href={`${API_BASE_URL}/uploads/${item.evidence}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mb-6"
                        >
                            <img
                                src={`${API_BASE_URL}/uploads/${item.evidence}`}
                                alt="Submitted evidence"
                                className="h-28 w-auto rounded-xl border border-gray-200 object-cover hover:opacity-90 transition"
                                loading="lazy"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </a>
                    )}

                    {/* Meta Matrix Data Block */}
                    <div className="grid sm:grid-cols-2 gap-4 bg-gray-50/70 p-4 rounded-xl border border-gray-100 mb-6 text-sm">
                        <div>
                            <span className="text-gray-400 font-bold block uppercase text-[10px] tracking-wider mb-0.5">Location Anchor</span>
                            <span className="text-gray-700 font-semibold break-words">{item.address}</span>
                        </div>
                        <div>
                            <span className="text-gray-400 font-bold block uppercase text-[10px] tracking-wider mb-0.5">Callback Reference</span>
                            <span className="text-gray-700 font-semibold bg-white px-2 py-0.5 rounded border border-gray-100 inline-block mt-0.5 break-all">{item.contact}</span>
                        </div>
                    </div>

                    {/* Control Action Toolbar */}
                    <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                        {!isResolved ? (
                            <button
                                onClick={() => handleResolve(item._id)}
                                disabled={isBusy}
                                className="bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-red-600/10 hover:shadow-red-600/20 transition-all transform active:scale-95 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                {isBusy ? 'Updating…' : 'Mark As Resolved'}
                            </button>
                        ) : (
                            <span className="text-green-600 font-extrabold text-sm flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                Resolution Completed
                            </span>
                        )}

                        <button
                            onClick={() => handleDelete(item._id)}
                            disabled={isBusy}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed p-2 rounded-xl transition-all duration-200 border border-transparent hover:border-red-100"
                            title="Delete Report Permanently"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 md:p-12">
            <div className="max-w-4xl mx-auto">

                {/* Dashboard Main Identity Header */}
                <header className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 md:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 sm:mb-10">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight uppercase">Admin Dashboard</h1>
                        <p className="text-gray-500 font-medium text-sm mt-1">Review verified community reports, update fix logs, and manage resolution states.</p>
                    </div>

                    <div className="flex gap-4 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-4 sm:pt-0">
                        <div className="bg-red-50 border border-red-100 px-5 py-3 rounded-2xl min-w-[90px] text-center shadow-sm flex-1 sm:flex-none">
                            <span className="block text-2xl font-black text-red-600 tracking-tight">{pending.length}</span>
                            <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Unsolved</span>
                        </div>
                        <div className="bg-green-50 border border-green-100 px-5 py-3 rounded-2xl min-w-[90px] text-center shadow-sm flex-1 sm:flex-none">
                            <span className="block text-2xl font-black text-green-600 tracking-tight">{resolved.length}</span>
                            <span className="text-[9px] font-bold text-green-500 uppercase tracking-wider">Archived</span>
                        </div>
                        <button
                            onClick={logout}
                            className="hidden sm:block text-gray-500 hover:text-red-600 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold transition"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                {/* Navigation Segment Control Tabs */}
                <div className="flex border-b border-gray-200 mb-8 gap-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`pb-4 px-4 font-bold text-sm tracking-wide border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'pending' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        <span className={`w-2 h-2 rounded-full ${activeTab === 'pending' ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></span>
                        Unsolved Cases ({pending.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('resolved')}
                        className={`pb-4 px-4 font-bold text-sm tracking-wide border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'resolved' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        <span className={`w-2 h-2 rounded-full ${activeTab === 'resolved' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                        Solved Archive ({resolved.length})
                    </button>
                </div>

                {/* Conditional View Rendering Pipeline */}
                <main className="space-y-6">
                    {loading ? (
                        <div className="text-center py-16 text-gray-400 font-semibold animate-pulse">Loading reports…</div>
                    ) : activeTab === 'pending' ? (
                        <section className="animate-in fade-in duration-200">
                            {pending.length === 0 ? (
                                <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl">
                                    <p className="text-gray-400 italic font-medium text-base">✨ Clear skies! No pending alerts on screen.</p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {pending.map(item => <ComplaintCard key={item._id} item={item} isResolved={false} />)}
                                </div>
                            )}
                        </section>
                    ) : (
                        <section className="animate-in fade-in duration-200">
                            {resolved.length === 0 ? (
                                <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl">
                                    <p className="text-gray-400 italic font-medium text-base">No items found inside the solved archive registry.</p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {resolved.map(item => <ComplaintCard key={item._id} item={item} isResolved={true} />)}
                                </div>
                            )}
                        </section>
                    )}
                </main>

            </div>
        </div>
    );
};

export default AdminDashboard;