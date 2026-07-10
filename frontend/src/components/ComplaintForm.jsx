import React, { useState } from 'react';
import api from '../api';

const MAX_FILE_SIZE_MB = 5;

const ComplaintForm = () => {
    const [formData, setFormData] = useState({
        category: 'Safety',
        customCategory: '',
        description: '',
        address: '',
        contact: '',
        evidence: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileName, setFileName] = useState("");
    const [fileError, setFileError] = useState("");

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileError("");

        if (file) {
            // Guard against huge uploads crashing the server / eating your storage quota in production
            if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                setFileError(`File is too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
                e.target.value = "";
                setFormData({ ...formData, evidence: null });
                setFileName("");
                return;
            }
            if (!file.type.startsWith('image/')) {
                setFileError("Only image files are allowed.");
                e.target.value = "";
                setFormData({ ...formData, evidence: null });
                setFileName("");
                return;
            }
            setFormData({ ...formData, evidence: file });
            setFileName(file.name);
        } else {
            setFormData({ ...formData, evidence: null });
            setFileName("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (fileError) return;
        setIsSubmitting(true);

        const finalCategory = formData.category === 'Other' ? formData.customCategory : formData.category;

        const data = new FormData();
        data.append('category', finalCategory || 'General Issue');
        data.append('description', formData.description);
        data.append('address', formData.address);
        data.append('contact', formData.contact);
        // BUG FIX: previously this always appended formData.evidence even when null,
        // which sends the literal string "null" as a file field to the backend.
        if (formData.evidence) {
            data.append('evidence', formData.evidence);
        }

        try {
            await api.post('/api/complaints/submit', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Complaint encrypted & submitted securely!");

            setFormData({
                category: 'Safety',
                customCategory: '',
                description: '',
                address: '',
                contact: '',
                evidence: null
            });
            setFileName("");
            e.target.reset();
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || "System upload error. Please try again.";
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300">

                {/* Secure Alert Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 sm:px-8 py-6 text-white relative">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">Incident Submission Portal</h1>
                    <p className="text-red-100/90 text-xs sm:text-sm mt-1 font-medium flex items-center gap-1.5">
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m0-8v3m0 0v.01M4.93 4.93l14.14 14.14M2 12h2m16 0h2M12 2v2m0 16v2"></path></svg>
                        End-to-end encrypted incident routing pipeline
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 md:p-10 space-y-6">
                    <div className="space-y-5">

                        {/* Dynamic Category Selector */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Report Category</label>
                            <div className="relative">
                                <select
                                    value={formData.category}
                                    className="block w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none cursor-pointer"
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="Safety">⚠️ Safety Hazard / Infrastructure</option>
                                    <option value="Cleanliness">🧼 Hygiene / Cleanliness Lapse</option>
                                    <option value="Harassment">🛡️ Threat / Harassment Incident</option>
                                    <option value="Other">✨ Other / Custom Issue</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Conditional Custom Field */}
                        {formData.category === 'Other' && (
                            <div className="animate-in fade-in slide-in-from-top-3 duration-200">
                                <label className="block text-xs font-bold text-red-600 uppercase tracking-widest mb-2">Specify Your Issue Category</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.customCategory}
                                    className="block w-full bg-red-50/30 border border-red-200 rounded-xl px-4 py-3.5 text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                    placeholder="e.g., WiFi Outage, Noise Complaint, Lost Item..."
                                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                                />
                            </div>
                        )}

                        {/* Description Textarea */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Incident Description</label>
                            <textarea
                                required
                                value={formData.description}
                                className="block w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all h-28 resize-none"
                                placeholder="Provide comprehensive details of what occurred or requires attention..."
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Location Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Location/Address</label>
                            <input
                                type="text"
                                required
                                value={formData.address}
                                className="block w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                placeholder="e.g., Block C, Room 402 or Main Gate Corridor"
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        {/* Photo Verification Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Photo Proof / Evidence</label>
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100/70 transition-colors duration-200 relative px-4">
                                    <div className="flex flex-col items-center justify-center pt-2 pb-2 text-center">
                                        <svg className="w-6 h-6 mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <p className="text-xs text-gray-500 font-semibold truncate max-w-xs">
                                            {fileName ? `Selected: ${fileName}` : "Click to select local verification image"}
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            </div>
                            {fileError && <p className="text-red-600 text-xs font-semibold mt-2">{fileError}</p>}
                        </div>

                        {/* Contact Info Input */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest mb-1">
                                Callback Link / Contact Details
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.contact}
                                className="block w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                                placeholder="Enter your email address or mobile number for updates"
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Submission Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/10 transition-all duration-300 transform active:scale-[0.99] tracking-wide text-center flex items-center justify-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                        {isSubmitting ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                                <span>Submit Securely</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ComplaintForm;