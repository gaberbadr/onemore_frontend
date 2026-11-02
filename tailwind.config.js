/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6A00', // Primary Accent
          dark: '#D95400',    // Primary Dark
        },
        brand: {
          black: '#0B0B0B',
          softBlack: '#171717',
          lightBg: '#F7F7F5',
          white: '#FFFFFF',
        },
        semantic: {
          success: '#22A06B',
          danger: '#D92D20',
          warning: '#FF8A00',
        },
        neutral: {
          50: '#F2F2F2',
          100: '#E5E5E5',
          400: '#A3A3A3',
          500: '#737373',
          800: '#404040',
        }
      },
      fontFamily: {
        sans: ['Cairo', 'Inter', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      }
    },
  },
  plugins: [],
}
