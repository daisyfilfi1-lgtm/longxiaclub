/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 薄荷绿主色调
        primary: {
          DEFAULT: '#14b8a6',
          light: '#5eead4',
          dark: '#0d9488',
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        // 辅助色
        accent: {
          cyan: '#06b6d4',
          emerald: '#10b981',
          sky: '#38bdf8',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#a855f7',
        },
      },
      backgroundImage: {
        'gradient-mint': 'radial-gradient(ellipse at 20% 20%, rgba(20, 184, 166, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(6, 182, 212, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.04) 0%, transparent 50%)',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 20px 40px -10px rgba(20, 184, 166, 0.15)',
        'teal': '0 10px 40px -10px rgba(20, 184, 166, 0.25)',
      },
    },
  },
  plugins: [],
}
