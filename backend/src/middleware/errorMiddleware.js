const ApiResponse = require('../utils/apiResponse');

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('🔥 Error:', err);
  }

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with ID of ${err.value}`;
    return ApiResponse.error(res, message, 404);
  }

  // Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value entered for '${field}'. Please provide a unique value.`;
    return ApiResponse.error(res, message, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => val.message);
    return ApiResponse.error(res, 'Validation failed', 400, errors);
  }

  // Multer Error (File too large, etc.)
  if (err.name === 'MulterError') {
    return ApiResponse.error(res, `Upload error: ${err.message}`, 400);
  }

  return ApiResponse.error(
    res,
    error.message || 'Internal Server Error',
    err.statusCode || 500
  );
};

module.exports = errorHandler;
