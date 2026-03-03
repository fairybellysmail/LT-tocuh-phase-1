/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'color-mix(in srgb, var(--brand-primary), transparent calc(100% - <alpha-value> * 100%))',
          soft: 'color-mix(in srgb, var(--brand-soft), transparent calc(100% - <alpha-value> * 100%))',
          accent: 'color-mix(in srgb, var(--brand-accent), transparent calc(100% - <alpha-value> * 100%))',
          bg: 'color-mix(in srgb, var(--brand-bg), transparent calc(100% - <alpha-value> * 100%))',
          text: 'color-mix(in srgb, var(--brand-text), transparent calc(100% - <alpha-value> * 100%))',
          muted: 'color-mix(in srgb, var(--brand-muted), transparent calc(100% - <alpha-value> * 100%))',
          'alt-bg': 'var(--brand-alt-bg)',
          footer: 'color-mix(in srgb, var(--brand-footer), transparent calc(100% - <alpha-value> * 100%))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'brand': '0.75rem',
      },
      boxShadow: {
        'brand': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      spacing: {
        'section-py': '6rem', // Default desktop section padding
      },
      lineHeight: {
        'tight': '1.1',
        'snug': '1.3',
      },
    },
  },
  plugins: [],
}
