/** @type {import('tailwindcss').Config} */

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter','sans-serif'],
      },
      colors: {
        custom: {
          lightgray: '#A4A3AD',
          gray: '#484659',
          darkpurple: '#333146',
          accent: '#7A73FF',
        }
      },
      borderRadius: {
        'card': '15px',
        'banner': '30px',
      },
    },
    fontSize: {
      sm: '14px',
      base: '16px',
      lg: '24px',
      xl: '48px',
      '2xl': '64px',
      '3xl': '96px',
      '4xl': '128px',
    },
  },
  plugins: [],
});
