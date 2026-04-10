const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    category: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true }, // Simple input field
    contact: { type: String, default: "Not provided" }, // Optional
    evidence: { type: String }, // Stores the filename or base64 string
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);