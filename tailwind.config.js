/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#152C61', // Navy Blue
        'secondary': '#AC292D', // Deep Red
        'navy': {
          600: '#152C61',
          700: '#0f1f45',
        },
        'red': {
          600: '#AC292D',
          700: '#8a2124',
        },
      },
    },
  },
  plugins: [],
} 