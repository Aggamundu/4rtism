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
      colors: {
        custom: {
          lightgray: '#A4A3AD',
          gray: '#484659',
          darkpurple: '#333146',
          accent: '#7A73FF',
          yellow: '#FFBB00',
          lightpurple: '#7D78AC',
          offwhite: '#F1F1F1',
          pink: '#D90368',
          orange: '#FB8B24',
          jade: '#04A777',
          green: '#688E26',
          purple: '#820263',
          brown: '#1C0015',
          darkAccent: '#494599',

        }
      },
      borderRadius: {
        'card': '15px',
        'banner': '10px',
      },
      padding: {
        'custom': '2%',
      },
    },
    fontSize: {
      sm: '14px',
      base: '16px',
      'md': '22px',
      lg: '24px',
      xl: '48px',
      '2xl': '64px',
      '3xl': '96px',
      '4xl': '128px',
    },
  },
  plugins: [],
});
