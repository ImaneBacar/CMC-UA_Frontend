/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066CC',
          50: '#e6f2ff',
          100: '#b3d9ff',
          500: '#0066CC',
          600: '#0052a3',
          700: '#003d7a',
        },
        secondary: {
          DEFAULT: '#00A896',
          500: '#00A896',
          600: '#008678',
        },
        accent: {
          DEFAULT: '#FF6B6B',
          500: '#FF6B6B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}