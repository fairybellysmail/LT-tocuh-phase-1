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
          primary: '#148A3B',
          soft: '#3AAE63',
          accent: '#E6A21A',
          bg: '#FFFFFF',
          text: '#1C1C1C',
          muted: '#6B7280',
          'alt-bg': 'rgba(58, 174, 99, 0.06)',
          footer: '#0F5C2A',
        },
      },
      borderRadius: {
        'brand': '0.75rem',
      },
      boxShadow: {
        'brand': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      spacing: {
        'section-mobile': '4rem', // py-16
        'section-desktop': '6rem', // py-24
      },
    },
  },
  plugins: [],
}
