/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core palette
        'midnight': {
          DEFAULT: '#0a0e27',
          50: '#1a1e3a',
          100: '#151935',
          200: '#12162f',
          300: '#0f1329',
          400: '#0c1024',
          500: '#0a0e27',
          600: '#080b1e',
          700: '#060916',
          800: '#04060f',
          900: '#020307',
        },
        'neon-cyan': {
          DEFAULT: '#00f5ff',
          50: '#e0feff',
          100: '#b3fcff',
          200: '#80faff',
          300: '#4df8ff',
          400: '#26f7ff',
          500: '#00f5ff',
          600: '#00c4cc',
          700: '#009399',
          800: '#006266',
          900: '#003133',
        },
        'electric-magenta': {
          DEFAULT: '#ff00ff',
          50: '#ffe0ff',
          100: '#ffb3ff',
          200: '#ff80ff',
          300: '#ff4dff',
          400: '#ff26ff',
          500: '#ff00ff',
          600: '#cc00cc',
          700: '#990099',
          800: '#660066',
          900: '#330033',
        },
        'silver': {
          DEFAULT: '#c0c0c0',
          50: '#f5f5f5',
          100: '#e8e8e8',
          200: '#d9d9d9',
          300: '#c0c0c0',
          400: '#a8a8a8',
          500: '#909090',
          600: '#787878',
          700: '#606060',
          800: '#484848',
          900: '#303030',
        },
        'glass': {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
          hover: 'rgba(255, 255, 255, 0.08)',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neon-glow': 'linear-gradient(135deg, #00f5ff 0%, #ff00ff 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3)',
        'neon-magenta': '0 0 20px rgba(255, 0, 255, 0.5), 0 0 40px rgba(255, 0, 255, 0.3)',
        'neon-glow': '0 0 30px rgba(0, 245, 255, 0.4), 0 0 60px rgba(255, 0, 255, 0.2)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 245, 255, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 245, 255, 0.8), 0 0 60px rgba(255, 0, 255, 0.4)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '20px',
      },
    },
  },
  plugins: [],
}
