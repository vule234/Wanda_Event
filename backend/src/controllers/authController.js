const { supabaseAdmin } = require('../config/supabase');

/**
 * Admin login
 */
async function login(req, res) {
  try {
    const { email, password } = req.validatedData;

    // Sign in with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Update last login
    await supabaseAdmin
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('user_id', data.user.id);

    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng nhập'
    });
  }
}

/**
 * Admin logout
 */
async function logout(req, res) {
  try {
    const { error } = await supabaseAdmin.auth.signOut();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi đăng xuất'
    });
  }
}

/**
 * Get current user info
 */
async function me(req, res) {
  try {
    let admin = req.admin || null;

    if (!admin) {
      const { data, error } = await supabaseAdmin
        .from('admins')
        .select('*')
        .eq('user_id', req.user.id)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Get user admin lookup error:', error);
        return res.status(500).json({
          success: false,
          message: 'Lỗi lấy thông tin người dùng'
        });
      }

      admin = data;
    }

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập'
      });
    }

    res.json({
      success: true,
      data: {
        id: req.user.id,
        email: req.user.email,
        role: admin.role,
        last_login: admin.last_login
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi lấy thông tin người dùng'
    });
  }
}

module.exports = {
  login,
  logout,
  me
};
