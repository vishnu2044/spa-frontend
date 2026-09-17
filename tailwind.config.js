/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aura: {
          bg: '#FCFBF7',
          surface: '#FFFFFF',
          surface2: '#F5F1E8',
          text: '#26302A',
          muted: '#69736C',
          accent: '#9A8060',
          'accent-light': '#B8A48E',
          green: '#DDE8DF',
          'green-dark': '#B5CCB9',
          border: '#E7E3DA',
          dark: {
            bg: '#1A1D1B',
            surface: '#22271F',
            surface2: '#2A2F27',
            text: '#E8EDE9',
            muted: '#8A9490',
            border: '#353C32',
          },
        },
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '1.1' }],
        'display-md': ['clamp(1.875rem, 4vw, 3rem)', { lineHeight: '1.15' }],
        'display-sm': ['clamp(1.5rem, 3vw, 2.25rem)', { lineHeight: '1.2' }],
      },
      borderRadius: {
        card: '12px',
        modal: '16px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(38,48,42,0.06)',
        'card-hover': '0 4px 16px rgba(38,48,42,0.10)',
        modal: '0 8px 40px rgba(38,48,42,0.12)',
        nav: '0 1px 12px rgba(38,48,42,0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.25s ease-out',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
