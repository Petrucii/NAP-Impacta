import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dde7ff',
          200: '#b9ceff',
          300: '#8caeff',
          400: '#5a8bff',
          500: '#2f6dff',
          600: '#1d53e6',
          700: '#163fb3',
          800: '#132f85',
          900: '#101f52',
        },
        ink: 'rgb(var(--ink) / <alpha-value>)',
        mute: 'rgb(var(--mute) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--accent-ink) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        card: '0.75rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgb(0 0 0 / 0.04), 0 2px 8px rgb(0 0 0 / 0.04)',
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
} satisfies Config;
