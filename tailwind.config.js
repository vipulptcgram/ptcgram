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
          DEFAULT: '#0f2545',
          50:  '#f0f4ff',
          100: '#dde7ff',
          200: '#c3d2ff',
          300: '#9ab4ff',
          400: '#6e8fff',
          500: '#4a6ef0',
          600: '#2a5298',
          700: '#1a3a6b',
          800: '#142d56',
          900: '#0f2545',
          950: '#08172d',
        },
        amber: {
          DEFAULT: '#c8872a',
          50:  '#fdf8f0',
          100: '#faedda',
          200: '#f5d9ae',
          300: '#eec07c',
          400: '#e8a040',
          500: '#c8872a',
          600: '#a96f1e',
          700: '#8a5718',
          800: '#6b4114',
          900: '#4d2e0e',
        },
        steel: '#4a5e7a',
        cream: '#f1ede4',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'industry': '0 4px 20px rgba(15,37,69,0.12)',
        'industry-lg': '0 12px 48px rgba(15,37,69,0.18)',
        'industry-xl': '0 24px 64px rgba(15,37,69,0.24)',
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
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(200,135,42,0.3)' },
          '50%':      { boxShadow: '0 0 0 10px rgba(200,135,42,0)' },
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
