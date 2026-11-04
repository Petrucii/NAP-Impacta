import type { Config } from 'tailwindcss';

/**
 * Design system NAP — minimalismo editorial.
 * Cores vêm de CSS vars (globals.css) para trocar claro/escuro sem `dark:`.
 * Raio único: `rounded-ui`. Qualquer outro `rounded-*` NÃO existe de propósito.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    borderRadius: {
      none: '0',
      ui: '0.375rem',
    },
    extend: {
      colors: {
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        field: 'rgb(var(--field) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--accent-hover) / <alpha-value>)',
        'accent-active': 'rgb(var(--accent-active) / <alpha-value>)',
        'accent-text': 'rgb(var(--accent-text) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      // Escala tipográfica rígida: caption · small · body · lead · title · heading · display
      fontSize: {
        caption: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.08em', fontWeight: '500' }],
        small: ['0.875rem', { lineHeight: '1.5rem' }],
        body: ['1rem', { lineHeight: '1.75rem' }],
        lead: ['1.25rem', { lineHeight: '2rem' }],
        title: ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em', fontWeight: '600' }],
        heading: ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        display: ['3.5rem', { lineHeight: '1.05', letterSpacing: '-0.035em', fontWeight: '600' }],
      },
      maxWidth: {
        content: '72rem',
        prose: '42rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
