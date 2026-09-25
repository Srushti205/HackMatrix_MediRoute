/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          lightYellow: '#FAF8AB',
          softYellow: '#FFFEC5',
          lighterYellow: '#FFFFE2',
          primaryGreen: '#71BC75',
          darkGreen: '#00A551',
          darkText: '#4A4A4A',
          secondaryText: '#687280',
          softGreenBg: '#E8F6E9',
          error: '#FFCEEB',
          warmWarning: '#FFF7D1',
          warmBg: '#FAF9F5',
          cardBg: '#FFFFFF',
          cardBorder: '#E6ECE3',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(113, 188, 117, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 30px -4px rgba(0, 165, 81, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
