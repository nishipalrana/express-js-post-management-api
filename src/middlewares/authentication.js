const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../env-config');

// Middleware for authentication and authorization
const authenticate = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};
module.exports = { authenticate };