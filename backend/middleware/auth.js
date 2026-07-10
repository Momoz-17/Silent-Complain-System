const jwt = require('jsonwebtoken');

// Protects routes that only a logged-in admin should be able to hit.
// BUG FIX: the original /resolve/:id and /:id (delete) routes had NO auth
// check at all — anyone who found the URL (e.g. via browser devtools) could
// delete or resolve any complaint without ever logging in.
function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}

module.exports = requireAdmin;