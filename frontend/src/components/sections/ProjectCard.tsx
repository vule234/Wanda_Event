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
    <Link href={`/projects/${slug}`} className="interactive-card touch-manipulation group block rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/25">
      <Card variant="glass" className="hover-lift cursor-pointer overflow-hidden active:scale-[0.99]">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-primary to-accent-purple">
          <div className="pointer-events-none absolute inset-0 bg-black/20 transition-smooth-slow duration-500 group-hover:bg-black/40"></div>
          <div className="pointer-events-none absolute inset-0 flex items-end p-6">
            <Badge variant="gold">{category}</Badge>
          </div>
        </div>
        <div className="space-y-3 p-6">
          <h3 className="headline-sm line-clamp-2 group-hover:text-accent-teal transition-smooth-slow">{title}</h3>
          <p className="body-sm text-on-surface/70 group-hover:text-accent-cyan transition-smooth-slow">Xem chi tiết →</p>
        </div>
      </Card>
    </Link>

  );
};
