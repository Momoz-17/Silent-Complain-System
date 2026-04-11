import React, { useState } from 'react';
import axios from 'axios';

const ComplaintForm = () => {
    const [formData, setFormData] = useState({
        category: 'Safety',
        description: '',
        address: '',
        contact: '',
        evidence: null
    });

    const handleFileChange = (e) => {
        setFormData({...formData, evidence: e.target.files[0]});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('address', formData.address);
        data.append('contact', formData.contact);
        data.append('evidence', formData.evidence);

        try {
            // UPDATED URL TO RENDER
            await axios.post('https://silent-complain-system.onrender.com/api/complaints/submit', data);
            alert("Submitted Secretly!");
            
            setFormData({
                category: 'Safety',
                description: '',
                address: '',
                contact: '',
                evidence: null
            });
            e.target.reset(); 
        } catch (err) {
            console.error(err);
            alert("Error submitting. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 border-b pb-4">Silent Complaint Portal</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Category</label>
                        <select value={formData.category} className="mt-1 block w-full border rounded-lg p-3" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                            <option value="Safety">Safety</option>
                            <option value="Cleanliness">Cleanliness</option>
                            <option value="Harassment">Harassment</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Description</label>
                        <textarea required value={formData.description} className="mt-1 block w-full border rounded-lg p-3 h-28" placeholder="Details..." onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Location</label>
                        <input type="text" required value={formData.address} className="mt-1 block w-full border rounded-lg p-3" placeholder="Building/Room" onChange={(e) => setFormData({...formData, address: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Photo Proof</label>
                        <input type="file" className="mt-1 block w-full" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Contact (Optional)</label>
                        <input type="text" value={formData.contact} className="mt-1 block w-full border rounded-lg p-3" onChange={(e) => setFormData({...formData, contact: e.target.value})} />
                    </div>
                </div>
                <button type="submit" className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition">Submit Secretly</button>
            </form>
        </div>
    );
};

export default ComplaintForm;