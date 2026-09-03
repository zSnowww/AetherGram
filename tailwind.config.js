/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tg: {
          bg: '#0e1621',
          surface: '#17212b',
          surfaceHover: '#202b36',
          border: '#242f3d',
          primary: '#2481cc',
          primaryHover: '#1c6cae',
          accent: '#2ba6fb',
          bubbleIn: '#182533',
          bubbleOut: '#2b5278',
          text: '#f5f5f5',
          muted: '#7e8c99',
          danger: '#e53935',
          warning: '#ff9800',
          success: '#4caf50',
        },
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(43, 166, 251, 0.4)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 5px rgba(43, 166, 251, 0.1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
