/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'safety-amber': '#FFBF00',
        'calming-blue': '#4CA1AF',
        'emergency-red': '#E63946',
      }
    },
  },
  plugins: [],
}
