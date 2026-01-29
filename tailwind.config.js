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
          900: '#0D1F17',
          800: '#1B4332',
          700: '#2D6A4F',
          600: '#40916C',
          500: '#52B788',
          400: '#74C69D',
          300: '#95D5B2',
        },
        dark: {
          deepest: '#0A0A0A',
          base: '#0D0D0D',
          elevated: '#1A1A1A',
          surface: '#262626',
          hover: '#333333',
        },
        chart: {
          green: '#52B788',
          blue: '#3B82F6',
          amber: '#F59E0B',
          red: '#EF4444',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          pink: '#EC4899',
          lime: '#84CC16',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'xl': '14px',
        '2xl': '20px',
        '3xl': '28px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'glow': '0 4px 14px rgba(45, 106, 79, 0.35)',
        'glow-lg': '0 6px 20px rgba(45, 106, 79, 0.45)',
      },
    },
  },
  plugins: [],
}
