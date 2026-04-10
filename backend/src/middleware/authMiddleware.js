const { supabaseAdmin } = require('../config/supabase');

/**
 * Verify JWT token and authenticate user
 */
async function authenticate(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const requestId = req.id || 'unknown';
    
    if (!authHeader) {
      console.warn(`[${requestId}] Missing authorization header`);
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy token xác thực',
        requestId
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.warn(`[${requestId}] Invalid authorization header format`);
      return res.status(401).json({
        success: false,
        message: 'Định dạng token không hợp lệ',
        requestId
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate token format (basic check)
    if (!token || token.length < 10) {
      console.warn(`[${requestId}] Token too short or empty`);
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ',
        requestId
      });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error) {
      console.warn(`[${requestId}] Token verification failed:`, error.message);
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn',
        requestId
      });
    }

    if (!user) {
      console.warn(`[${requestId}] No user found for token`);
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại',
        requestId
      });
    }

    // Attach user to request
    req.user = user;
    console.info(`[${requestId}] User authenticated: ${user.email}`);
    next();
  } catch (error) {
    const requestId = req.id || 'unknown';
    console.error(`[${requestId}] Auth middleware error:`, error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực',
      requestId
    });
  }
}

/**
 * Check if user is admin
 */
async function requireAdmin(req, res, next) {
  try {
    const requestId = req.id || 'unknown';

    if (!req.user) {
      console.warn(`[${requestId}] No user in request`);
      return res.status(401).json({
        success: false,
        message: 'Chưa xác thực',
        requestId
      });
    }

    // Check if user exists in admins table
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('user_id', req.user.id)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(`[${requestId}] Admin lookup failed:`, error.message);
      return res.status(500).json({
        success: false,
        message: 'Lỗi kiểm tra quyền',
        requestId
      });
    }

    if (!admin) {
      console.warn(`[${requestId}] User is not admin: ${req.user.email}`);
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập',
        requestId
      });
    }

    req.admin = admin;
    console.info(`[${requestId}] Admin verified: ${req.user.email}`);
    next();
  } catch (error) {
    const requestId = req.id || 'unknown';
    console.error(`[${requestId}] Admin check error:`, error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi kiểm tra quyền',
      requestId
    });
  }
}

module.exports = {
  authenticate,
  requireAdmin
};
