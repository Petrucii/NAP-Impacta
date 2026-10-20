import { Link } from 'react-router-dom';
import {
  HeartHandshake,
  GraduationCap,
  Accessibility,
  Compass,
  BookOpen,
  Users,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import type { Service } from '@/types/api';

const ICONS: Record<string, LucideIcon> = {
  'heart-handshake': HeartHandshake,
  'graduation-cap': GraduationCap,
  accessibility: Accessibility,
  compass: Compass,
  'book-open': BookOpen,
  users: Users,
};

export function ServiceCard({ service }: { service: Service }) {
  const Icon = ICONS[service.icon] ?? HeartHandshake;
  return (
    <Link
      to={`/servicos/${service.slug}`}
      className="group block rounded-card border border-border bg-surface p-6 shadow-soft transition hover:border-accent hover:shadow-md no-underline"
    >
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
        <Icon size={20} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-ink">{service.title}</h3>
      <p className="mt-2 text-sm text-mute leading-relaxed">{service.summary}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
        Saber mais
        <ArrowRight size={14} aria-hidden="true" className="transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
