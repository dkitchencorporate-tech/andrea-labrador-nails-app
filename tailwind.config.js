/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#f5f8f6',
          100: '#e5ece7',
          200: '#cbd8cf',
          300: '#a7beb0',
          400: '#7d988d', // Color exacto del dossier de Andrea Labrador
          500: '#648577',
          600: '#4e6b5e',
          700: '#3f564c',
          800: '#34463e',
          900: '#2c3b35',
        },
        warm: {
          50: '#fdfcfb',
          100: '#fbf9f6', // Fondo suave cálido editorial
          200: '#f5f0ea',
          300: '#eae3d8',
          800: '#232a26',
          900: '#181f1c', // Texto casi negro carbón de alta costura
        },
        gold: {
          400: '#e0c598',
          500: '#c5a880', // Acento champagne sutil
          600: '#a68a62',
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(125, 152, 141, 0.12)',
        'luxury': '0 12px 36px -4px rgba(24, 31, 28, 0.08), 0 4px 12px -2px rgba(125, 152, 141, 0.06)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
