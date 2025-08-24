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
          yellow: '#FFD701',
          lightpurple: '#7D78AC',
          offwhite: '#F1F1F1',
          pink1: '#D90368',
          pink2: '#FF047B',
          pink3: '#AA0252',
          pink4: '#FF5C77',
          orange: '#FB8B24',
          jade: '#04A777',
          green: '#62d446',
          purple: '#820263',
          brown: '#955315',
          beige: '#e1c08c',
          darkAccent: '#494599',
          blue: '#2096f3',
          lightblue: '#4EC2FF',
          accent: '#2096f3',
          darkblue: '#494599',
          red: "#ad0015"

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
