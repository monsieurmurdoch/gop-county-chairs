/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gop: {
          red: '#E81B23',
          blue: '#003366',
        },
      },
    },
  },
  plugins: [],
}
