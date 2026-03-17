/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#5f5fc4",
          DEFAULT: "#40407a",
          dark: "#323261",
        },
      },
    },
  },
  plugins: [],
}

