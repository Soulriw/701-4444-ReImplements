/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./frontend/index.html",
    "./frontend/src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#0a0a0a',
        'gold': '#FEC564',
        'primary': '#FEC564',
      },
      fontFamily: {
        'irish': ['Irish Grover', 'cursive'],
      },
    },
  },
  plugins: [],
}

