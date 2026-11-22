/**
 * Consistent Standardized REST API Response Formatter
 */

class ApiResponse {
  static success(res, message = 'Success', data = null, statusCode = 200, extra = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...extra,
    });
  }

  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errors || undefined,
    });
  }
}

module.exports = ApiResponse;
