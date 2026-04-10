/**
 * Zalo Bot Integration
 * Gửi thông báo lead qua Zalo Bot API (bot-api.zaloplatforms.com)
 *
 * Yêu cầu:
 *   - ZALO_BOT_TOKEN  : token của bot (lấy từ Zalo Developer Portal)
 *   - ZALO_RECIPIENT_ID : sender_id của admin (lấy từ webhook sau khi nhắn bot 1 lần)
 */

const axios = require('axios');

const ZALO_API_BASE = 'https://bot-api.zaloplatforms.com';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseNumber(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function classifyZaloError(error) {
  if (error.code === 'ECONNABORTED') {
    return { code: 'timeout', message: 'Zalo API timeout' };
  }
  if (error.response?.status === 401 || error.response?.status === 403) {
    return { code: 'auth_error', message: 'Bot token không hợp lệ hoặc hết hạn' };
  }
  if (error.response?.status === 404) {
    return { code: 'endpoint_not_found', message: 'Zalo API endpoint không tồn tại' };
  }
  if (error.response?.status >= 500) {
    return { code: 'server_error', message: 'Zalo API server lỗi' };
  }
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return { code: 'unreachable', message: 'Không kết nối được Zalo API' };
  }

  // Zalo trả về ok:false trong body
  const body = error.response?.data;
  if (body && body.ok === false) {
    return {
      code: `zalo_${body.error_code || 'api_error'}`,
      message: body.description || 'Zalo API từ chối yêu cầu'
    };
  }

  return { code: 'unknown_error', message: error.message || 'Lỗi không xác định' };
}

/**
 * Gửi tin nhắn văn bản qua Zalo Bot API
 * @param {string} chatId   - sender_id của người nhận (Zalo user ID dạng hex)
 * @param {string} message  - Nội dung tin nhắn
 */
async function sendZaloMessage(chatId, message) {
  const startedAt = Date.now();

  const token = process.env.ZALO_BOT_TOKEN;

  if (!token) {
    return {
      success: false,
      skipped: true,
      code: 'missing_token',
      message: 'ZALO_BOT_TOKEN chưa được cấu hình',
      attempts: 0,
      durationMs: 0
    };
  }

  if (!chatId) {
    return {
      success: false,
      skipped: true,
      code: 'missing_recipient',
      message: 'ZALO_RECIPIENT_ID chưa được cấu hình',
      attempts: 0,
      durationMs: 0
    };
  }

  const timeoutMs = parseNumber(process.env.ZALO_TIMEOUT_MS, 8000);
  const maxRetries = parseNumber(process.env.ZALO_MAX_RETRIES, 2);
  const retryDelayMs = parseNumber(process.env.ZALO_RETRY_DELAY_MS, 800);
  const maxAttempts = Math.max(1, maxRetries + 1);

  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await axios.post(
        `${ZALO_API_BASE}/bot${token}/sendMessage`,
        {
          chat_id: chatId,
          text: message
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: timeoutMs
        }
      );

      const body = response.data;

      // Zalo trả 200 nhưng ok:false → vẫn là lỗi
      if (body && body.ok === false) {
        const err = new Error(`Zalo API error: ${body.description}`);
        err.response = { status: 200, data: body };
        throw err;
      }

      return {
        success: true,
        skipped: false,
        code: 'sent',
        message: 'Gửi Zalo thành công',
        attempts: attempt,
        durationMs: Date.now() - startedAt,
        status: response.status,
        responseData: body
      };
    } catch (error) {
      lastError = error;
      const classified = classifyZaloError(error);

      console.error(`[Zalo] Attempt ${attempt}/${maxAttempts} failed: ${classified.message}`);

      if (attempt < maxAttempts) {
        await sleep(retryDelayMs * attempt);
      } else {
        return {
          success: false,
          skipped: false,
          code: classified.code,
          message: classified.message,
          attempts: attempt,
          durationMs: Date.now() - startedAt,
          status: error.response?.status,
          responseData: error.response?.data,
          rawError: error.message
        };
      }
    }
  }

  return {
    success: false,
    skipped: false,
    code: 'unknown_error',
    message: lastError?.message || 'Lỗi không xác định',
    attempts: maxAttempts,
    durationMs: Date.now() - startedAt
  };
}

/**
 * Format nội dung tin nhắn thông báo lead mới
 */
function formatLeadMessage(lead) {
  const eventDate = lead.event_date
    ? new Date(lead.event_date).toLocaleDateString('vi-VN')
    : 'Chưa xác định';

  const dashboardUrl = process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3000/admin';

  return `🔔 LEAD MỚI TỪ WEBSITE

👤 Tên: ${lead.name}
📞 SĐT: ${lead.phone}
📧 Email: ${lead.email || 'Không có'}
🎉 Loại sự kiện: ${lead.event_type || 'Không xác định'}
📅 Ngày sự kiện: ${eventDate}
📝 Nội dung: ${lead.message || 'Không có'}
🕒 Tạo lúc: ${new Date(lead.created_at).toLocaleString('vi-VN')}

👉 Dashboard: ${dashboardUrl}`;
}

/**
 * Gửi thông báo lead mới tới admin qua Zalo Bot
 */
async function sendLeadNotification(lead) {
  const recipientId = process.env.ZALO_RECIPIENT_ID;
  const message = formatLeadMessage(lead);
  return sendZaloMessage(recipientId, message);
}

module.exports = {
  sendZaloMessage,
  formatLeadMessage,
  sendLeadNotification
};
