/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // VANESEV Author Design System (Noir / Cassis / Crema / Tinta)
        noche: '#0C0A0E',
        obsidiana: '#141218',
        carbon: '#1C1922',
        tinta: '#16151A',
        grafito: '#3A3742',
        niebla: '#65626D',
        ceniza: '#96929F',
        linea: '#E4DFD7',
        'linea-fuerte': '#D2CBC0',
        crema: '#F7F4EF',
        papel: '#EFECE6',
        cassis: '#8E1B46',
        'cassis-hondo': '#6B1233',
        oro: '#C8A96A',
        exito: '#1F8A5B',

        // Scoped legacy tokens ONLY for Andrea Labrador Nails tenant (/andrea-nails)
        sage: {
          50: '#f5f8f6',
          100: '#e5ece7',
          200: '#cbd8cf',
          300: '#a7beb0',
          400: '#7d988d',
          500: '#648577',
          600: '#4e6b5e',
          700: '#3f564c',
          800: '#34463e',
          900: '#2c3b35',
        },
        warm: {
          50: '#fdfcfb',
          100: '#fbf9f6',
          200: '#f5f0ea',
          300: '#eae3d8',
          800: '#232a26',
          900: '#181f1c',
        },
        gold: {
          400: '#e0c598',
          500: '#c5a880',
          600: '#a68a62',
        }
      },
      fontFamily: {
        display: ['DM Sans', 'Plus Jakarta Sans', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'DM Sans', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        andrea: ['Cormorant Garamond', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(22, 21, 26, 0.08)',
        'luxury': '0 20px 50px -12px rgba(12, 10, 14, 0.14)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
