/**
 * Generate unique request ID for tracking
 */
function generateRequestId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Request ID middleware - attach to each request
 */
function requestIdMiddleware(req, res, next) {
  req.id = generateRequestId();
  res.setHeader('X-Request-ID', req.id);
  next();
}

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  const requestId = req.id || 'unknown';
  const timestamp = new Date().toISOString();
  
  // Log error with context
  console.error(`[${timestamp}] [Request ID: ${requestId}] Error:`, {
    message: err.message,
    code: err.code,
    status: err.status,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  // Supabase/Database errors
  if (err.code) {
    return res.status(400).json({
      success: false,
      message: 'Lỗi cơ sở dữ liệu',
      requestId,
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      requestId,
      errors: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Authentication errors
  if (err.status === 401) {
    return res.status(401).json({
      success: false,
      message: 'Không được phép truy cập',
      requestId
    });
  }

  // Authorization errors
  if (err.status === 403) {
    return res.status(403).json({
      success: false,
      message: 'Không có quyền truy cập',
      requestId
    });
  }

  // Default error
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Lỗi máy chủ nội bộ',
    requestId,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

/**
 * 404 Not Found handler
 */
function notFoundHandler(req, res) {
  const requestId = req.id || 'unknown';
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy endpoint',
    requestId,
    path: req.path,
    method: req.method
  });
}

module.exports = {
  requestIdMiddleware,
  errorHandler,
  notFoundHandler
};
