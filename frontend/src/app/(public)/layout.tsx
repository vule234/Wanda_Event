import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { FloatingCTA } from '@/components/common/FloatingCTA';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <FloatingCTA />
    </div>
  );
}
