/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'ibm-plex-mono': ['IBM Plex Mono', 'sans-serif'],
      },
    },
    fontSize: {
      xs: '12px',
      sm: '12px',
      base: '12px',
      lg: '16px',
      xl: '20px',
      '2xl': '32px',
      '3xl': '40px',
      '4xl': '48px',
    }
  },
  plugins: [],
}

const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
});
