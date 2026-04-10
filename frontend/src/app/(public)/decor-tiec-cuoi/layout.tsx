import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Decor Tiệc Cưới | Pi Decor',
  description:
    'Pi Decor - Kiến tạo không gian cưới sang trọng và giàu cảm xúc với các dịch vụ trang trí gia tiên, nhà hàng và tiệc cưới ngoài trời.',
  openGraph: {
    title: 'Decor Tiệc Cưới | Pi Decor',
    description:
      'Khám phá các dự án decor tiệc cưới cao cấp của Pi Decor cho gia tiên, nhà hàng và không gian ngoài trời.',
    type: 'website',
  },
};

export default function DecorTiecCuoiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
