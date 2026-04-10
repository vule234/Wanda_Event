const { supabaseAdmin } = require('../config/supabase');

const MIN_SUBMIT_MS = Number(process.env.CONTACT_MIN_SUBMIT_MS || 2500);
const DUPLICATE_WINDOW_MINUTES = Number(process.env.CONTACT_DUPLICATE_WINDOW_MINUTES || 30);
const MAX_URLS_IN_MESSAGE = Number(process.env.CONTACT_MAX_URLS_IN_MESSAGE || 2);
const SUSPICIOUS_KEYWORDS = [
  'viagra',
  'casino',
  'crypto',
  'backlink',
  'seo service',
  'loan',
  'telegram',
  'whatsapp',
  'http://',
  'https://',
  'www.',
];

function normalizeText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().replace(/\s+/g, ' ');
}

function countUrls(value) {
  const matches = value.match(/https?:\/\/|www\./gi);
  return matches ? matches.length : 0;
}

function hasRepeatedCharacters(value) {
  return /(.)\1{8,}/i.test(value);
}

function buildSoftSuccessResponse(res) {
  return res.status(200).json({
    success: true,
    message: 'Yêu cầu của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.',
  });
}

async function antiSpamGuard(req, res, next) {
  try {
    const {
      website,
      submitted_after_ms: submittedAfterMs,
      name,
      phone,
      email,
      event_type: eventType,
      event_date: eventDate,
      message,
    } = req.validatedData;

    if (normalizeText(website)) {
      return buildSoftSuccessResponse(res);
    }

    if (typeof submittedAfterMs === 'number' && submittedAfterMs > 0 && submittedAfterMs < MIN_SUBMIT_MS) {
      return res.status(400).json({
        success: false,
        message: 'Thao tác gửi quá nhanh. Vui lòng kiểm tra lại thông tin và thử lại.',
      });
    }

    const normalizedMessage = normalizeText(message || '');
    const urlCount = countUrls(normalizedMessage);
    const keywordHit = SUSPICIOUS_KEYWORDS.some((keyword) => normalizedMessage.toLowerCase().includes(keyword));

    if (urlCount > MAX_URLS_IN_MESSAGE || hasRepeatedCharacters(normalizedMessage) || keywordHit) {
      return res.status(400).json({
        success: false,
        message: 'Nội dung chưa phù hợp để gửi. Vui lòng điều chỉnh thông tin và thử lại.',
      });
    }

    const duplicateSince = new Date(Date.now() - DUPLICATE_WINDOW_MINUTES * 60 * 1000).toISOString();
    const recentLeadQuery = supabaseAdmin
      .from('leads')
      .select('id, name, phone, email, event_type, event_date, message, created_at')
      .gte('created_at', duplicateSince)
      .order('created_at', { ascending: false })
      .limit(10);

    const duplicateFilter = email ? `phone.eq.${phone},email.eq.${email}` : `phone.eq.${phone}`;
    const { data: recentLeads, error } = await recentLeadQuery.or(duplicateFilter);
    if (error) {
      throw error;
    }

    const normalizedName = normalizeText(name).toLowerCase();
    const normalizedEmail = normalizeText(email || '').toLowerCase();

    const duplicateLead = (recentLeads || []).find((lead) => {
      const sameMessage = normalizeText(lead.message || '') === normalizedMessage;
      const sameName = normalizeText(lead.name || '').toLowerCase() === normalizedName;
      const sameEmail = normalizeText(lead.email || '').toLowerCase() === normalizedEmail;
      const sameEventType = normalizeText(lead.event_type || '') === normalizeText(eventType || '');
      const sameEventDate = normalizeText(lead.event_date || '') === normalizeText(eventDate || '');

      if (normalizedMessage) {
        return sameMessage && (sameName || sameEmail || lead.phone === phone);
      }

      return (sameName || sameEmail || lead.phone === phone) && sameEventType && sameEventDate;
    });

    if (duplicateLead) {
      return buildSoftSuccessResponse(res);
    }

    req.antiSpam = {
      submittedAfterMs,
      duplicateCheckedAt: new Date().toISOString(),
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  antiSpamGuard,
};
