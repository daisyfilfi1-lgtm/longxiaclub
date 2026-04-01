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
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#12121a',
        'bg-card': '#16161f',
        'text-primary': '#fafafa',
        'text-secondary': '#a1a1aa',
        'text-tertiary': '#71717a',
      },
    },
  },
  plugins: [],
}
