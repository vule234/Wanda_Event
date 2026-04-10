const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Email template base styles
 */
const emailStyles = `
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
`;

const headerStyles = `
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  text-align: center;
  border-radius: 8px 8px 0 0;
`;

const containerStyles = `
  max-width: 600px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
`;

const footerStyles = `
  background: #f8f9fa;
  padding: 20px;
  text-align: center;
  border-top: 1px solid #e0e0e0;
  font-size: 12px;
  color: #7f8c8d;
`;

/**
 * Send email notification
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 */
async function sendEmail({ to, subject, html }) {
  try {
    // Validate email
    if (!to || !to.includes('@')) {
      throw new Error('Invalid recipient email');
    }

    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@mercurywanda.com',
      subject,
      html,
      replyTo: process.env.ADMIN_EMAIL || 'admin@mercurywanda.com'
    };

    await sgMail.send(msg);
    console.log(`[Email] Sent to ${to} - Subject: ${subject}`);
    return true;
  } catch (error) {
    console.error('[Email Error]', error.message);
    throw new Error('Failed to send email');
  }
}

/**
 * Send lead notification to admin
 */
async function sendLeadNotification(lead) {
  const html = `
    <div style="${containerStyles}">
      <div style="${headerStyles}">
        <h1 style="margin: 0; font-size: 24px;">🎉 Lead Mới Từ Website</h1>
      </div>
      
      <div style="padding: 30px;">
        <h2 style="color: #667eea; margin-top: 0;">Thông Tin Khách Hàng</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;"><strong>Tên:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${lead.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;"><strong>Số điện thoại:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;"><a href="tel:${lead.phone}">${lead.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;"><strong>Email:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;"><a href="mailto:${lead.email}">${lead.email || 'Không có'}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;"><strong>Loại sự kiện:</strong></td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0;">${lead.event_type || 'Không xác định'}</td>
          </tr>
          <tr>
            <td style="padding: 10px;"><strong>Ngày sự kiện:</strong></td>
            <td style="padding: 10px;">${lead.event_date ? new Date(lead.event_date).toLocaleDateString('vi-VN') : 'Chưa xác định'}</td>
          </tr>
        </table>

        ${lead.message ? `
          <h3 style="color: #667eea; margin-top: 20px;">Tin Nhắn</h3>
          <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #667eea; border-radius: 4px;">
            ${lead.message}
          </div>
        ` : ''}

        <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 4px;">
          <p style="margin: 0; color: #0277bd;"><strong>⏰ Hành động:</strong> Vui lòng liên hệ khách hàng trong vòng 24 giờ</p>
        </div>
      </div>

      <div style="${footerStyles}">
        <p style="margin: 0;">Mercury Wanda - Event Management Platform</p>
        <p style="margin: 5px 0 0 0;">Email được gửi tự động từ hệ thống</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@mercurywanda.com',
    subject: `🎉 Lead mới: ${lead.name} - ${lead.event_type || 'Sự kiện'}`,
    html
  });
}

/**
 * Send thank you email to customer
 */
async function sendThankYouEmail(lead) {
  const html = `
    <div style="${containerStyles}">
      <div style="${headerStyles}">
        <h1 style="margin: 0; font-size: 24px;">🎊 Cảm Ơn Bạn!</h1>
      </div>
      
      <div style="padding: 30px;">
        <p>Xin chào <strong>${lead.name}</strong>,</p>
        
        <p>Cảm ơn bạn đã liên hệ với <strong>Mercury Wanda</strong>! Chúng tôi đã nhận được yêu cầu tư vấn của bạn về <strong>${lead.event_type || 'sự kiện'}</strong>.</p>

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 16px;"><strong>⏰ Đội ngũ tư vấn sẽ liên hệ với bạn trong vòng 24 giờ</strong></p>
        </div>

        <h3 style="color: #667eea;">Trong thời gian chờ đợi, bạn có thể:</h3>
        <ul style="padding-left: 20px;">
          <li><a href="https://mercurywanda.com/projects" style="color: #667eea; text-decoration: none;">📸 Xem các dự án đã thực hiện</a></li>
          <li><a href="https://mercurywanda.com/library" style="color: #667eea; text-decoration: none;">🎨 Khám phá thư viện ảnh & video</a></li>
          <li><a href="https://mercurywanda.com/about" style="color: #667eea; text-decoration: none;">ℹ️ Tìm hiểu thêm về Mercury Wanda</a></li>
        </ul>

        <p style="margin-top: 20px;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
        <p style="margin: 10px 0;">
          📞 <strong>Hotline:</strong> <a href="tel:0909123456" style="color: #667eea; text-decoration: none;">0909 123 456</a><br>
          📧 <strong>Email:</strong> <a href="mailto:info@mercurywanda.com" style="color: #667eea; text-decoration: none;">info@mercurywanda.com</a>
        </p>

        <p style="margin-top: 30px;">Trân trọng,<br><strong>Mercury Wanda Team</strong></p>
      </div>

      <div style="${footerStyles}">
        <p style="margin: 0;">© 2026 Mercury Wanda. All rights reserved.</p>
        <p style="margin: 5px 0 0 0;">
          <a href="https://mercurywanda.com" style="color: #667eea; text-decoration: none;">Website</a> | 
          <a href="https://mercurywanda.com/privacy" style="color: #667eea; text-decoration: none;">Privacy Policy</a>
        </p>
      </div>
    </div>
  `;

  if (lead.email) {
    return sendEmail({
      to: lead.email,
      subject: 'Cảm ơn bạn đã liên hệ Mercury Wanda 🎊',
      html
    });
  }
}

module.exports = {
  sendEmail,
  sendLeadNotification,
  sendThankYouEmail
};
