/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'ivory' : '#E3F4F4',
        grass: '#78C850',
        poison: '#A040A0',
        fire: '#F08030',
        flying: '#A890F0',
      }
    },
  },
  plugins: [],
}

