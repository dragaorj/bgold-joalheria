/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F5F1E9",
        champagne: "#C6A667",
        gold: "#B89550",
        charcoal: "#111110",
        stone: "#D8D1C5",
      },
      fontFamily: {
        serif: ['"Against"', "Georgia", "serif"],
        sans: ['"Quicksand"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
