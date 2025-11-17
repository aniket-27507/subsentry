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
        primary: {
          light: '#6366F1',
          DEFAULT: '#6366F1',
          dark: '#818CF8',
        },
        secondary: '#64748B',
        success: {
          light: '#10B981',
          DEFAULT: '#10B981',
          dark: '#34D399',
        },
        warning: {
          light: '#F59E0B',
          DEFAULT: '#F59E0B',
          dark: '#FBBF24',
        },
        danger: {
          light: '#EF4444',
          DEFAULT: '#EF4444',
          dark: '#F87171',
        },
        'dark-bg': '#0F172A',
        'dark-surface': '#1E293B',
        'dark-surface-hover': '#334155',
        'dark-border': '#334155',
        'dark-text': '#F1F5F9',
        'dark-text-secondary': '#CBD5E1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

