import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  GraduationCap,
  Accessibility,
  Compass,
  BookOpen,
  Users,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import type { Service } from '@/types/api';
import { cardLinkClass } from '@/components/ui/Card';

const ICONS: Record<string, LucideIcon> = {
  'heart-handshake': HeartHandshake,
  'graduation-cap': GraduationCap,
  accessibility: Accessibility,
  compass: Compass,
  'book-open': BookOpen,
  users: Users,
};

export function ServiceCard({ service, index }: { service: Service; index?: number }) {
  const Icon = ICONS[service.icon] ?? HeartHandshake;
  return (
    <Link to={`/servicos/${service.slug}`} className={cardLinkClass}>
      <div className="flex items-start justify-between">
        <Icon size={24} aria-hidden="true" className="text-ink" />
        {index !== undefined ? (
          <span className="text-caption text-muted" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
        ) : null}
      </div>
      <h3 className="mt-8">{service.title}</h3>
      <p className="mt-2 flex-1 text-small text-muted">{service.summary}</p>
      <span className="mt-6 inline-flex items-center gap-1 text-small font-medium text-ink">
        Saber mais
        <ArrowUpRight
          size={16}
          aria-hidden="true"
          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
