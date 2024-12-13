import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Defensive check to ensure req and res are defined
  if (!req || !res) {
    return res.status(400).json({ message: 'Request or Response object is missing' });
  }

  // Check if headers exist
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  // Extract token from the Authorization header
  const token = req.headers.authorization.split(' ')[1]; // "Bearer <token>"

  // If there's no token, return an error
  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY||"secretkey");
    req.user = decoded; // Attach the decoded user info to the request object

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

export default authMiddleware;
