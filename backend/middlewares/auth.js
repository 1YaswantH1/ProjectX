// middlewares/auth.js
module.exports = function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized: Please log in' });
};
