const express = require('express');
const router = express.Router();
const multer = require('multer');
const Complaint = require('../models/Complaint');

// 1. Setup Multer for Photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// 2. Submit Complaint
router.post('/submit', upload.single('evidence'), async (req, res) => {
    try {
        const { category, description, address, contact } = req.body;
        const newComplaint = new Complaint({
            category, description, address, contact,
            evidence: req.file ? req.file.filename : null
        });
        await newComplaint.save();
        res.status(201).json({ success: true });
    } catch (err) { res.status(500).json({ error: "Failed to submit" }); }
});

// 3. Get All Complaints
router.get('/all', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) { res.status(500).json({ error: "Fetch failed" }); }
});

// 4. FIX: Mark as Resolved (Matches frontend handleResolve)
router.put('/resolve/:id', async (req, res) => {
    try {
        const updated = await Complaint.findByIdAndUpdate(
            req.params.id, 
            { status: "Resolved" }, 
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Complaint not found" });
        res.json({ message: "Updated successfully" });
    } catch (err) { res.status(500).json({ error: "Update failed" }); }
});

// 5. FIX: Delete Complaint (Matches frontend handleDelete)
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Complaint.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Complaint not found" });
        res.json({ message: "Deleted successfully" });
    } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

module.exports = router;