/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B0F14',
          50:  '#F4F5F6',
          100: '#E5E7E9',
          200: '#CDD1D5',
          300: '#A9B0B7',
          400: '#7C8791',
          500: '#59636D',
          600: '#3D464F',
          700: '#293038',
          800: '#171C22',
          900: '#0B0F14',
          950: '#06080B',
        },
        amber: {
          DEFAULT: '#C7743D',
          50:  '#FCF6F2',
          100: '#F7E9DF',
          200: '#EFD0BC',
          300: '#E3AD89',
          400: '#D68A58',
          500: '#C7743D',
          600: '#AA5D2E',
          700: '#884722',
          800: '#69371C',
          900: '#4A2817',
        },
        steel: '#59636D',
        cream: '#F4EFEA',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'industry': '0 4px 20px rgba(11,15,20,0.12)',
        'industry-lg': '0 12px 48px rgba(11,15,20,0.18)',
        'industry-xl': '0 24px 64px rgba(11,15,20,0.24)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease both',
        'fade-in': 'fadeIn 0.5s ease both',
        'float': 'float 4s ease-in-out infinite',
        'load-bar': 'loadBar 2s ease-in-out forwards',
        'pulse-amber': 'pulseAmber 2s ease infinite',
        'spin-slow': 'spin 4s linear infinite',
        'spin-reverse': 'spinReverse 6s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        loadBar: {
          '0%':   { width: '0%' },
          '100%': { width: '100%' },
        },
        pulseAmber: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(199,116,61,0.3)' },
          '50%':      { boxShadow: '0 0 0 10px rgba(199,116,61,0)' },
        },
        spinReverse: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [],
}
