const { getClientIp } = require('./rateLimitMiddleware');

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const TURNSTILE_PLACEHOLDER_SECRET = 'your_turnstile_secret_key_here';
const TURNSTILE_PLACEHOLDER_PROD_SECRET = 'your_production_turnstile_secret_key_here';

function isTurnstileEnabled() {
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim();
  return Boolean(
    secretKey &&
      secretKey !== TURNSTILE_PLACEHOLDER_SECRET &&
      secretKey !== TURNSTILE_PLACEHOLDER_PROD_SECRET
  );
}

async function verifyTurnstile(req, res, next) {
  if (!isTurnstileEnabled()) {
    return next();
  }

  try {
    const token = req.validatedData?.captcha_token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng xác thực CAPTCHA trước khi gửi yêu cầu.',
      });
    }

    const body = new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    });

    const clientIp = getClientIp(req);
    if (clientIp && clientIp !== 'unknown') {
      body.set('remoteip', clientIp);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      throw new Error(`Turnstile verify failed with status ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Xác thực CAPTCHA không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.',
      });
    }

    req.turnstile = {
      challengeTs: result.challenge_ts,
      hostname: result.hostname,
      action: result.action,
      cdata: result.cdata,
    };

    next();
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return res.status(502).json({
      success: false,
      message: 'Không thể xác thực CAPTCHA lúc này. Vui lòng thử lại sau ít phút.',
    });
  }
}

module.exports = {
  isTurnstileEnabled,
  verifyTurnstile,
};
