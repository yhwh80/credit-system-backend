// middleware/authMiddleware.js

module.exports = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login'); // Or use res.status(401).json({ message: 'Login required' }) for APIs
};

