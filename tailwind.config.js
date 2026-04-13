/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#020b18',
          900: '#040f22',
          800: '#071428',
          700: '#0c1f3d',
          600: '#122850',
          500: '#1a3566',
        },
        gold: {
          300: '#f0d878',
          400: '#e8c84a',
          500: '#c9a832',
          600: '#a88820',
        },
        ucl: {
          blue:   '#4f9cf9',
          silver: '#b0bec5',
        },
      },
      fontFamily: {
        display: ['Barlow Condensed', 'sans-serif'],
        sans:    ['Barlow', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
