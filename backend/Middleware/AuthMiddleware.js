import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';

const authMiddleware = (req, res, next) => {
  if (!req || !res) {
    return res.status(400).json({ message: 'Request or Response object is missing' });
  }

  if (!req.headers || !req.headers.authorization) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const token = req.headers.authorization.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded; // Attach decoded user info to the request object
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired.' });
    }
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }
    console.log(currentUser)

    console.log("User Role from Token:", currentUser.role);  // Debugging line
    console.log("Expected roles:", roles);  // Debugging line

    // Check if the current user's role is in the allowed roles
    if (!roles.includes(currentUser.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};


export { authMiddleware, authorizeRoles };
