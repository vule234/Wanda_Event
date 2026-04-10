const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];

  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim();
  }

  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function buildLimiterMessage(message) {
  return {
    success: false,
    message,
  };
}

function createLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => ipKeyGenerator(getClientIp(req)),
    message: buildLimiterMessage(message),
  });
}

const leadBurstLimiter = createLimiter({
  windowMs: 60 * 1000,
  max: 2,
  message: 'Bạn đang gửi yêu cầu quá nhanh. Vui lòng chờ một chút rồi thử lại.',
});

const leadLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau 15 phút.',
});

const contactLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Quá nhiều yêu cầu liên hệ. Vui lòng thử lại sau 15 phút.',
});

const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.',
});

module.exports = {
  getClientIp,
  leadBurstLimiter,
  leadLimiter,
  contactLimiter,
  apiLimiter,
};

