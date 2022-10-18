/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          900: '#121214',
          800: '#18181B'
        },
        caption: {
          500: '#71717A',
          400: '#A1A1AA',
          300: '#D4D4D8'
        },
        primary: '#8B5CF6',
        success: '#34D399',
        alert: '#F87171',
        shape: '#2A2634',
        text: '#FFFFFF',
        overlay: 'rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
