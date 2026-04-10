const { supabaseAdmin } = require('../config/supabase');
const { sendLeadNotification, sendThankYouEmail } = require('../config/email');
const { sendLeadNotification: sendZaloNotification } = require('../config/zalo');

function buildLeadUpdatePayload(validatedData) {
  const payload = { ...validatedData };

  if (payload.status === 'closed' && !payload.last_follow_up_at) {
    payload.last_follow_up_at = new Date().toISOString();
  }

  if (payload.status === 'processing' && !payload.contacted_at) {
    payload.contacted_at = new Date().toISOString();
  }

  return payload;
}

async function createLead(req, res) {
  try {
    const {
      website,
      submitted_after_ms: submittedAfterMs,
      captcha_token: captchaToken,
      ...validatedLead
    } = req.validatedData;

    const leadData = {
      ...validatedLead,
      email: validatedLead.email || null,
      event_type: validatedLead.event_type || null,
      event_date: validatedLead.event_date || null,
      message: validatedLead.message || null,
      source: 'Website Contact Form',
      status: 'new',
      priority: 'medium',
    };

    const { data, error } = await supabaseAdmin.from('leads').insert([leadData]).select().single();
    if (error) throw error;

    const strictMode = process.env.ZALO_STRICT_MODE === 'true';
    const zaloResult = await sendZaloNotification(data);

    sendLeadNotification(data).catch((err) => console.error('Admin email notification error:', err));
    sendThankYouEmail(data).catch((err) => console.error('Customer thank-you email error:', err));

    if (!zaloResult.success && !zaloResult.skipped && strictMode) {
      return res.status(502).json({
        success: false,
        message: 'Đã lưu thông tin nhưng gửi thông báo Zalo thất bại. Vui lòng thử lại sau.',
        data: { id: data.id, name: data.name },
        meta: { zalo: zaloResult },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Gửi yêu cầu thành công. Chúng tôi sẽ liên hệ với bạn sớm!',
      data: { id: data.id, name: data.name },
      meta: { zalo: zaloResult },
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ success: false, message: 'Lỗi gửi yêu cầu. Vui lòng thử lại sau.' });
  }
}

async function getLeads(req, res) {
  try {
    const { page = 1, limit = 50, status, event_type, search, priority } = req.query;
    const pageNumber = Number(page) || 1;
    const pageSize = Number(limit) || 50;
    const offset = (pageNumber - 1) * pageSize;

    let query = supabaseAdmin.from('leads').select('*', { count: 'exact' });

    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (event_type) query = query.eq('event_type', event_type);
    if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);

    const { data, error, count } = await query.order('created_at', { ascending: false }).range(offset, offset + pageSize - 1);
    if (error) throw error;

    res.json({
      success: true,
      data,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách leads' });
  }
}

async function getLeadById(req, res) {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin.from('leads').select('*').eq('id', id).single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lead' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get lead detail error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết lead' });
  }
}

async function updateLead(req, res) {
  try {
    const { id } = req.params;
    const updateData = buildLeadUpdatePayload(req.validatedData);

    const { data, error } = await supabaseAdmin
      .from('leads')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy lead để cập nhật' });
    }

    res.json({ success: true, message: 'Cập nhật lead thành công', data });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật lead' });
  }
}

async function deleteLead(req, res) {
  try {
    const { id } = req.params;
    const { error } = await supabaseAdmin.from('leads').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Xóa lead thành công' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ success: false, message: 'Lỗi xóa lead' });
  }
}

async function exportLeads(req, res) {
  try {
    const { data, error } = await supabaseAdmin.from('leads').select('*').order('created_at', { ascending: false });
    if (error) throw error;

    const headers = [
      'ID',
      'Tên',
      'Số điện thoại',
      'Email',
      'Loại sự kiện',
      'Ngày sự kiện',
      'Trạng thái',
      'Ưu tiên',
      'Nguồn',
      'Ngày tạo',
    ];

    const rows = (data || []).map((lead) => [
      lead.id,
      lead.name,
      lead.phone,
      lead.email || '',
      lead.event_type || '',
      lead.event_date || '',
      lead.status,
      lead.priority || '',
      lead.source,
      new Date(lead.created_at).toLocaleString('vi-VN'),
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=leads-${Date.now()}.csv`);
    res.send('\uFEFF' + csv);
  } catch (error) {
    console.error('Export leads error:', error);
    res.status(500).json({ success: false, message: 'Lỗi xuất dữ liệu' });
  }
}

async function getLeadStats(req, res) {
  try {
    const [{ count: newCount }, { count: processingCount }, { count: closedCount }, { count: totalCount }] = await Promise.all([
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'closed'),
      supabaseAdmin.from('leads').select('*', { count: 'exact', head: true }),
    ]);

    res.json({
      success: true,
      data: {
        new: newCount || 0,
        processing: processingCount || 0,
        closed: closedCount || 0,
        total: totalCount || 0,
      },
    });
  } catch (error) {
    console.error('Get lead stats error:', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy thống kê leads' });
  }
}

module.exports = {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads,
  getLeadStats,
};
