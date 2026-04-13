/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        off: {
          white: '#f7f6f4',
          50:    '#f4f3f0',
          100:   '#edecea',
          200:   '#dddbd7',
          300:   '#c4c2bd',
        },
        ink: {
          900: '#0f0f0f',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#3a3a3a',
          500: '#5a5a5a',
          400: '#8a8a8a',
          300: '#ababab',
          200: '#cacaca',
          100: '#e5e5e5',
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
