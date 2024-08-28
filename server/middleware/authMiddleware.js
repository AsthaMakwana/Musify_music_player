const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assumes token is in the form "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });

        }
        req.user = decoded; // Attach user info to request object
        next();
    });
};


// Middleware to restrict access to admins only
exports.adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ message: "Admins Only!!" });
    next();
};
