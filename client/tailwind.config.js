/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#991B1B', // Maroon
        accent: '#B45309', // Gold
        'gray-850': '#1f2937',
        'gray-855': '#111827',
      }
    },
  },
  plugins: [],
}
