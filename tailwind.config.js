/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./DecisionNavigator.jsx"
  ],
  theme: {
    extend: {
      colors: {
        'terronez-navy': '#211f60',
        'terronez-yellow': '#ffd230'
      }
    },
  },
  plugins: [],
}