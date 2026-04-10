import React from 'react';
import { LinkButton } from '@/components/ui/Button';

export const metadata = {
  title: 'Cảm Ơn Bạn | Wanda Event',
  description: 'Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi sớm nhất có thể.',
};

export default function ThankYouPage() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center bg-surface">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-5xl">✅</span>
        </div>

        <h1 className="display-lg mb-4">Cảm Ơn Bạn!</h1>

        <p className="body-lg text-on-surface/80 mb-4">
          Yêu cầu của bạn đã được gửi thành công đến đội ngũ Wanda Event.
        </p>

        <p className="body-md text-on-surface/60 mb-10">
          Chúng tôi sẽ liên hệ với bạn trong vòng <strong>24 giờ làm việc</strong> qua email hoặc điện thoại để thảo luận chi tiết về sự kiện của bạn.
        </p>

        {/* What's Next */}
        <div className="bg-surface-container-low rounded-sm p-6 mb-10 text-left">
          <p className="label-lg mb-4">Bước Tiếp Theo</p>
          <ol className="space-y-3">
            {[
              'Đội ngũ Wanda Event xem xét yêu cầu của bạn',
              'Chuyên viên tư vấn sẽ liên hệ để hiểu thêm nhu cầu',
              'Chúng tôi gửi báo giá và concept sơ bộ',
              'Ký kết hợp đồng và bắt đầu triển khai',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-secondary rounded-sm text-on-secondary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="body-md text-on-surface">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <LinkButton href="/" variant="primary" size="lg">
            Về Trang Chủ
          </LinkButton>
          <LinkButton href="/projects" variant="secondary" size="lg">
            Xem Các Dự Án
          </LinkButton>
        </div>

        {/* Contact Info */}
        <p className="body-sm text-on-surface/50 mt-10">
          Cần hỗ trợ khẩn cấp?{' '}
          <a href="tel:+84909000000" className="text-primary hover:text-primary-container transition-colors">
            Gọi ngay: +84 (909) 000-000
          </a>
        </p>
      </div>
    </div>
  );
}
