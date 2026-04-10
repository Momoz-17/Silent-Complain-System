require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const complaintRoutes = require('./routes/complaintRoutes');
const Admin = require('./models/Admin');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve the uploads folder statically so images can be viewed in the dashboard
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("Database connection error:", err));

// --- ADMIN AUTH ROUTES ---

// Registration: Use this once to create your account in Atlas, then you can delete it.
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ success: true, message: "Admin registered successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: "Registration failed" });
    }
});

// Login: Finds admin in Atlas and compares hashed password
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            return res.status(401).json({ success: false, message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
            // Generate a token for secure session
            const token = jwt.sign(
                { id: admin._id }, 
                process.env.JWT_SECRET || 'secret_key', 
                { expiresIn: '1h' }
            );
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// --- COMPLAINT ROUTES ---
app.use('/api/complaints', complaintRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));