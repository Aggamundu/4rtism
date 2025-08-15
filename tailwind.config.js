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
          gray: '#3d3d3d',
          darkgray: '#1e1e1e',
          darkpurple: '#333146',
          accent: '#569cd6',
          yellow: '#FFBB00',
          lightpurple: '#7D78AC',
          offwhite: '#F1F1F1',
          pink: '#D970D7',
          orange: '#FB8B24',
          jade: '#04A777',
          green: '#62d446',
          purple: '#820263',
          brown: '#1C0015',
          darkAccent: '#494599',
          blue: '#569CD6',
          lightblue: '#4EC2FF',
          beige: '#e1c08c',

        }
      },
      borderRadius: {
        'card': '15px',
        'banner': '10px',
      },
      padding: {
        'custom': '5%',
      },
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      'md': '20px',
      lg: '24px',
      xl: '48px',
      '2xl': '64px',
      '3xl': '96px',
      '4xl': '128px',
    },
  },
  plugins: [],
});
