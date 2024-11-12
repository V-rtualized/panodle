/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pano: {
          DEFAULT: '#0a98da',
        },
        panolighter: {
          DEFAULT: '#3aa7da',
        },
        panodarker: {
          DEFAULT: '#097cb1',
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
