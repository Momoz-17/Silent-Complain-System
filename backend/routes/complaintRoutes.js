const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');
const requireAdmin = require('../middleware/auth');

// Store uploads relative to the project root, not relative to wherever the
// process happens to be launched from (this routes file lives in /routes,
// so a bare 'uploads/' path here was fragile).
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 1. Setup Multer for Photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        // Sanitize the original filename so it can't be used for a path
        // traversal / weird-character attack (e.g. "../../server.js").
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        cb(null, `${Date.now()}-${safeName}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB — previously unlimited, a single bad upload could fill your disk
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed'));
        }
        cb(null, true);
    }
});

// Small helper: previously an invalid Mongo ObjectId (e.g. someone hitting
// /api/complaints/resolve/123) would throw an uncaught CastError and return
// a raw 500. Validate up front and return a clean 400 instead.
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// 2. Submit Complaint (public)
router.post('/submit', (req, res) => {
    upload.single('evidence')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message || "Upload failed" });
        }
        try {
            const { category, description, address, contact } = req.body;
            if (!category || !description || !address) {
                return res.status(400).json({ error: "Category, description and address are required" });
            }
            const newComplaint = new Complaint({
                category, description, address, contact,
                evidence: req.file ? req.file.filename : null
            });
            await newComplaint.save();
            res.status(201).json({ success: true });
        } catch (err) {
            console.error("Submit error:", err);
            res.status(500).json({ error: "Failed to submit" });
        }
    });
});

// 3. Get All Complaints (public — used by public feed + transparency page + admin dashboard)
router.get('/all', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ createdAt: -1 });
        res.json(complaints);
    } catch (err) {
        console.error("Fetch error:", err);
        res.status(500).json({ error: "Fetch failed" });
    }
});

// 4. Mark as Resolved — ADMIN ONLY
router.put('/resolve/:id', requireAdmin, async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: "Invalid complaint id" });
        }
        const updated = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status: "Resolved" },
            { new: true }
        );
        if (!updated) return res.status(404).json({ error: "Complaint not found" });
        res.json({ message: "Updated successfully" });
    } catch (err) {
        console.error("Resolve error:", err);
        res.status(500).json({ error: "Update failed" });
    }
});

// 5. Delete Complaint — ADMIN ONLY
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: "Invalid complaint id" });
        }
        const deleted = await Complaint.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Complaint not found" });

        // Clean up the evidence file from disk so deleted reports don't leave orphaned uploads behind
        if (deleted.evidence) {
            const filePath = path.join(uploadDir, deleted.evidence);
            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') console.error("Failed to remove evidence file:", err);
            });
        }

        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ error: "Delete failed" });
    }
});

// 6. Upvote (public) — NOTE: this route was previously defined TWICE in this
// file (an exact duplicate). Express would just always use the first one and
// silently ignore the second, but it's dead code / a maintenance trap. Kept
// a single, clean copy here.
router.put('/upvote/:id', async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ error: "Invalid complaint id" });
        }
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { $inc: { upvotes: 1 } },
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: "Incident report not found" });
        }

        res.json(updatedComplaint);
    } catch (err) {
        console.error("Upvote error:", err);
        res.status(500).json({ error: "Internal server error, could not increment vote" });
    }
});

module.exports = router;