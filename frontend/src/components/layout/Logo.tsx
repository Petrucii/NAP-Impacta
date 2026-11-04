import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link
      to="/"
      aria-label="NAP Impacta — página inicial"
      className="inline-flex items-center gap-3 text-ink no-underline"
    >
      <img src="/logo.png" alt="" width={32} height={32} className="h-8 w-8 rounded-ui" />
      <span className="text-lead font-semibold tracking-tight">
        NAP <span className="font-normal text-muted">Impacta</span>
      </span>
    </Link>
  );
}
