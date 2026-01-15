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
        // Dark mode colors
        'dark-bg': '#0a0a0a',
        'dark-bg-secondary': '#1a1a1a',
        'dark-bg-tertiary': '#2a2a2a',
        'dark-text': '#ffffff',
        'dark-text-secondary': '#e0e0e0',
        'dark-text-tertiary': '#a0a0a0',
        'dark-border': '#333333',
        'dark-accent': '#2563eb', // Subtle blue
        'dark-accent-light': '#3b82f6',
        
        // Light mode colors
        'light-bg': '#ffffff',
        'light-bg-secondary': '#f8f9fa',
        'light-bg-tertiary': '#f0f2f5',
        'light-text': '#1a1a1a',
        'light-text-secondary': '#404040',
        'light-text-tertiary': '#707070',
        'light-border': '#e0e0e0',
        'light-accent': '#2563eb',
        'light-accent-light': '#3b82f6',
      },
      keyframes: {
        flow: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'rise-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        flow: 'flow 3s ease infinite',
        'rise-in': 'rise-in 0.7s ease-out forwards',
      },
    },
  },
  plugins: [],
}
