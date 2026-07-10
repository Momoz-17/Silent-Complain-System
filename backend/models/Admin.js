const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    // lowercase + trim so "Admin@Site.com" and "admin@site.com" aren't treated as different accounts
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('Admin', AdminSchema);