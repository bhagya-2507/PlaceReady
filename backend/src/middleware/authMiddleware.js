const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

/**
 * Protect routes - Verifies JWT from Authorization header or cookie
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return ApiResponse.error(res, 'Authentication required. Please sign in.', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'placeready_super_secure_jwt_secret_key_2026_capstone_college_project');
    const user = await User.findById(decoded.id);

    if (!user) {
      return ApiResponse.error(res, 'The user belonging to this token no longer exists.', 401);
    }

    if (!user.isActive) {
      return ApiResponse.error(res, 'Your account has been deactivated. Please contact TPO.', 403);
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return ApiResponse.error(res, 'Session expired. Please sign in again.', 401);
    }
    return ApiResponse.error(res, 'Invalid authentication token.', 401);
  }
};

/**
 * Role-based Authorization Middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `Access denied. Role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this resource.`,
        403
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
