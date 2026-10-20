import { useEffect } from 'react';

type Props = {
  title: string;
  description?: string;
};

export function Seo({ title, description }: Props) {
  useEffect(() => {
    const fullTitle = title.endsWith('NAP Impacta') ? title : `${title} — NAP Impacta`;
    document.title = fullTitle;
    if (description) {
      let el = document.querySelector('meta[name="description"]');
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', 'description');
        document.head.appendChild(el);
      }
      el.setAttribute('content', description);
    }
  }, [title, description]);
  return null;
}
