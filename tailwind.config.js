/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(214, 74%, 49%)',
        accent: 'hsl(145, 72%, 47%)',
        surface: 'hsl(0, 0%, 100%)',
        bg: 'hsl(210, 36%, 96%)',
        'text-primary': 'hsl(220, 13%, 18%)',
        'text-secondary': 'hsl(220, 13%, 38%)',
        purple: {
          900: '#2D1B69',
          800: '#3730A3',
          700: '#4338CA',
          600: '#5B21B6',
        }
      },
      borderRadius: {
        'lg': '16px',
        'md': '10px',
        'sm': '6px',
      },
      spacing: {
        'lg': '20px',
        'md': '12px',
        'sm': '8px',
      },
      boxShadow: {
        'card': '0 8px 24px hsla(0, 0%, 0%, 0.12)',
        'modal': '0 12px 32px hsla(0, 0%, 0%, 0.16)',
      }
    },
  },
  plugins: [],
}