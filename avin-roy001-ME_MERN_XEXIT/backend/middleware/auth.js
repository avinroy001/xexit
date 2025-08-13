const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (role) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Access denied" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      req.userRole = decoded.role;

      if (role && decoded.role !== role) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      res.status(400).json({ message: "Invalid token" });
    }
  };
};