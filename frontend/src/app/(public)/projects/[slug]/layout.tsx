import { Metadata } from 'next';
import { getServiceCategoryLabel } from '@/lib/service-config';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/projects/${params.slug}`);
    const data = await response.json();

    if (!data.success || !data.data) {
      return {
        title: 'Dự án không tìm thấy',
        description: 'Dự án bạn tìm kiếm không tồn tại',
      };
    }

    const project = data.data;
    const brandName = project.brand === 'pi-decor' ? 'Pi Decor' : 'Wanda Event';
    const categoryLabel = getServiceCategoryLabel(project.service_category || project.category);

    return {
      title: `${project.title} | ${brandName}`,
      description:
        project.description?.substring(0, 160) || `${categoryLabel} tại ${project.venue || brandName}`,
      openGraph: {
        title: `${project.title} | ${brandName}`,
        description: project.description?.substring(0, 160),
        images: project.thumbnail
          ? [
              {
                url: project.thumbnail,
                width: 1200,
                height: 630,
                alt: project.title,
              },
            ]
          : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${project.title} | ${brandName}`,
        description: project.description?.substring(0, 160),
        images: project.thumbnail ? [project.thumbnail] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Dự án | Wanda Event',
      description: 'Xem chi tiết dự án tổ chức sự kiện và decor cưới của Wanda Event / Pi Decor',
    };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
