import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

interface ProjectCardProps {
  id: string;
  title: string;
  category: string;
  image: string;
  slug: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  category,
  image,
  slug,
}) => {
  return (
    <Link href={`/projects/${slug}`}>
      <Card variant="glass" className="hover-lift cursor-pointer overflow-hidden group">
        <div className="aspect-video bg-gradient-to-br from-primary to-accent-purple relative overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-smooth-slow duration-500"></div>
          <div className="absolute inset-0 flex items-end p-6">
            <Badge variant="gold">{category}</Badge>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <h3 className="headline-sm line-clamp-2 group-hover:text-accent-teal transition-smooth-slow">{title}</h3>
          <p className="body-sm text-on-surface/70 group-hover:text-accent-cyan transition-smooth-slow">Xem chi tiết →</p>
        </div>
      </Card>
    </Link>
  );
};
