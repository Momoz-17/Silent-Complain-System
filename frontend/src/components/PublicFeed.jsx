import React, { useEffect, useState } from 'react';
import api from '../api';

const UPVOTE_STORAGE_KEY = 'upvotedIssueIds';

const loadUpvotedIds = () => {
    try {
        const raw = localStorage.getItem(UPVOTE_STORAGE_KEY);
        return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
        return new Set();
    }
};

const PublicFeed = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    // BUG FIX: previously this reset on every page refresh, letting anyone
    // spam-upvote the same issue just by reloading. Persist it in localStorage
    // instead (still not bulletproof against a determined user, but fixes the
    // accidental/casual double-vote case).
    const [upvotedItems, setUpvotedItems] = useState(loadUpvotedIds);

    const fetchPublicIssues = async () => {
        try {
            const res = await api.get('/api/complaints/all');
            const activeIssues = res.data.filter(issue => issue.status === "Pending");
            setIssues(activeIssues);
        } catch (err) {
            console.error("Error fetching public feed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublicIssues();
    }, []);

    const handleUpvote = async (id) => {
        if (upvotedItems.has(id)) return;

        try {
            await api.put(`/api/complaints/upvote/${id}`);

            setIssues(prevIssues =>
                prevIssues.map(issue =>
                    issue._id === id ? { ...issue, upvotes: (issue.upvotes || 0) + 1 } : issue
                )
            );
            setUpvotedItems(prev => {
                const next = new Set(prev).add(id);
                localStorage.setItem(UPVOTE_STORAGE_KEY, JSON.stringify([...next]));
                return next;
            });
        } catch (err) {
            console.error("Upvote request failed:", err);
            alert("Could not register upvote. Try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 md:p-12">
            <div className="max-w-4xl mx-auto">

                <header className="mb-8 sm:mb-10 text-left">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold rounded-full text-xs uppercase tracking-wider border border-blue-100">
                        Community Bulletin
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-3 mb-2">
                        Active Local Issues
                    </h1>
                    <p className="text-gray-500 font-medium">
                        See an issue already reported below? Upvote it to increase its urgency instead of submitting a duplicate ticket.
                    </p>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-gray-400 font-semibold animate-pulse">
                        Scanning community reports...
                    </div>
                ) : issues.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-dashed border-gray-200 rounded-2xl">
                        <p className="text-gray-400 font-medium italic">No active community issues found. Everything is smooth sailing!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {issues.map((item) => {
                            const hasUpvoted = upvotedItems.has(item._id);
                            return (
                                <div
                                    key={item._id}
                                    className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="space-y-3 flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                                                {item.category}
                                            </span>
                                            <span className="text-xs font-mono text-gray-400 break-words">
                                                📍 {item.address}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 font-semibold text-base sm:text-lg break-words">
                                            "{item.description}"
                                        </p>
                                        <p className="text-xs font-medium text-gray-400">
                                            Reported on {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleUpvote(item._id)}
                                        disabled={hasUpvoted}
                                        className={`shrink-0 flex items-center sm:flex-col justify-center gap-2 px-5 py-3 sm:py-4 sm:px-6 rounded-xl border font-bold transition-all ${
                                            hasUpvoted
                                                ? 'bg-orange-50 border-orange-200 text-orange-600 cursor-default'
                                                : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 active:scale-95'
                                        }`}
                                    >
                                        <svg className={`w-5 h-5 ${hasUpvoted ? 'text-orange-600 scale-110' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                        </svg>
                                        <div className="sm:text-center text-left">
                                            <span className="block text-xl font-black leading-tight">{item.upvotes || 0}</span>
                                            <span className="block text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                                                {hasUpvoted ? "Upvoted" : "Me Too"}
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicFeed;