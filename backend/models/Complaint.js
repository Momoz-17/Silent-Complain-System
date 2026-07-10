const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    address: { type: String, required: true, trim: true },
    contact: { type: String, default: "Not provided", trim: true },
    evidence: { type: String },
    status: { type: String, default: "Pending", enum: ["Pending", "Resolved"] },
    createdAt: { type: Date, default: Date.now },
    upvotes: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);