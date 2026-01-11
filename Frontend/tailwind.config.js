/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2B93E2",
        white: "#FFFFFF",
        black: "#000000",
      },
      fontFamily: {
        spaceGrotesk: ["Space Grotesk", 'system-ui', 'sans-serif'], // Added system-ui
        montserrat: ["Montserrat", 'system-ui', 'sans-serif'],      // Added system-ui
        mullish: ["Mulish", 'system-ui', 'sans-serif']              // Added system-ui
      },
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
    },
    screens: {
      'xxs': '380px',
      'xs': '400px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
}