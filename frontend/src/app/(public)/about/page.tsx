import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

export const metadata: Metadata = {
  title: 'Về Wanda Event | Câu chuyện thương hiệu & triết lý sáng tạo',
  description:
    'Khám phá câu chuyện thương hiệu Wanda Event - đơn vị tổ chức và trang trí sự kiện cao cấp với triết lý thiết kế tinh tế, chỉn chu và giàu cảm xúc.',
};

export default function AboutPage() {
  return <AboutPageClient />;
}
