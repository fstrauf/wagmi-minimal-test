/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dao-red': '#FF6666',
        'dao-green': '#008090',
        'dao-dark': 'rgb(16 22 35)'
      }
    },
  },
  plugins: [],
}
