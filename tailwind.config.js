/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        eve: {
          bg: "#05060a",
          panel: "#0f1720",
          accent: "#00c3d8",
          muted: "#9aa4b2"
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      boxShadow: {
        eve: "0 0 20px rgba(0,195,216,0.15)"
      }
    },
  },
  plugins: [],
}
