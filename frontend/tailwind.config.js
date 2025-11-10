/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ec4899', // pink theme
        secondary: '#f472b6',
        darkBg: '#1f2937',
      },
    },
  },
  plugins: [],
};
