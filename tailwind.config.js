/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#fdfcfa',
          100: '#faf8f5',
          200: '#f5f1eb',
          300: '#ede8e0',
          400: '#e0d9cf',
        },
        warm: {
          100: '#e8e4df',
          200: '#d4cfc8',
          300: '#b8b2aa',
          400: '#9a9490',
          500: '#7a7570',
          600: '#5a5550',
          700: '#3a3530',
          800: '#2a2520',
          900: '#1a1815',
        },
        sand: {
          300: '#d4b483',
          400: '#c8a96e',
          500: '#b8995e',
        },
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
      },
    },
  },
  plugins: [],
}
