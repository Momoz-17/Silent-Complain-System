require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const dns = require('dns');
const complaintRoutes = require('./routes/complaintRoutes');
const Admin = require('./models/Admin');

// Fail fast instead of silently signing tokens with a guessable fallback
// secret. The original code did `process.env.JWT_SECRET || 'secret_key'`,
// which means if you forgot to set JWT_SECRET in production, every admin
// token would be signed with the literal string "secret_key" — trivial for
// anyone to forge a valid admin token.
if (!process.env.JWT_SECRET) {
    console.error("FATAL: JWT_SECRET is not set in your environment. Refusing to start.");
    process.exit(1);
}
if (!process.env.MONGO_URI) {
    console.error("FATAL: MONGO_URI is not set in your environment. Refusing to start.");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

dns.setDefaultResultOrder('ipv4first');
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// --- Security & parsing middleware ---
app.use(helmet());
app.use(express.json());

// CORS: restrict to your actual frontend origin in production via ALLOWED_ORIGIN.
// Wide-open cors() (any origin) is fine for local dev but you don't want that
// on a live server that also holds an admin login endpoint.
const allowedOrigin = process.env.ALLOWED_ORIGIN;
app.use(cors(allowedOrigin ? { origin: allowedOrigin } : {}));

// Serve the uploads folder statically so images can be viewed in the dashboard
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic rate limiting on auth endpoints to slow down brute-force login/registration attempts
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { success: false, message: "Too many attempts, please try again later." }
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => {
        console.error("Database connection error:", err);
        process.exit(1);
    });

// --- ADMIN AUTH ROUTES ---

// Registration.
// BUG FIX / SECURITY: this endpoint used to be completely open — anyone on
// the internet could POST to /api/auth/register and create themselves a
// valid admin account with full delete/resolve access. It's now locked
// behind two checks: (1) a shared setup secret only you know, and (2) it
// refuses to run again once at least one admin already exists, so it can
// only ever be used once to bootstrap your own account.
app.post('/api/auth/register', authLimiter, async (req, res) => {
    try {
        const { email, password, setupKey } = req.body;

        if (!process.env.SETUP_KEY || setupKey !== process.env.SETUP_KEY) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        const existingAdminCount = await Admin.countDocuments();
        if (existingAdminCount > 0) {
            return res.status(403).json({ success: false, message: "Registration is closed" });
        }

        if (!email || !password || password.length < 8) {
            return res.status(400).json({ success: false, message: "Valid email and a password of at least 8 characters are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ email, password: hashedPassword });
        await newAdmin.save();
        res.status(201).json({ success: true, message: "Admin registered successfully" });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ success: false, error: "Registration failed" });
    }
});

// Login
app.post('/api/auth/login', authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
            const token = jwt.sign(
                { id: admin._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.json({ success: true, token });
        } else {
            // NOTE: deliberately the same generic message as the "admin not found"
            // branch above — telling an attacker "admin not found" vs "wrong
            // password" lets them enumerate valid admin emails.
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// --- COMPLAINT ROUTES ---
app.use('/api/complaints', complaintRoutes);

// --- 404 handler ---
// Without this, any typo'd or unknown route (e.g. someone probing /api/admin)
// falls through to Express's default HTML error page instead of clean JSON.
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// --- Global error handler ---
// A safety net so an unexpected thrown error anywhere never leaks a stack
// trace to the client and never crashes the whole process.
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(err.status || 500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));