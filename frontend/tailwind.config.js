/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#f59e0b', dark: '#d97706', light: '#fbbf24' },
        dark: { DEFAULT: '#0f172a', card: '#1e293b', border: '#334155', muted: '#475569' }
      }
    }
  },
  plugins: []
}
