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
          dark: '#030712',
          card: '#0a0f1d',
          border: 'rgba(255, 255, 255, 0.08)',
          navy: '#0f172a',
          indigo: '#6366f1',
          purple: '#a855f7',
          pink: '#ec4899',
          gold: '#eab308',
          teal: '#14b8a6',
          zinc: '#71717a'
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-glow': '0 8px 32px 0 rgba(99, 102, 241, 0.15)',
        'gold-glow': '0 8px 32px 0 rgba(234, 179, 8, 0.15)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
