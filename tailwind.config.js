/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: { DEFAULT: '#0F6A4A', deep: '#0A4D38', dark: '#07382A', light: '#1B8A66', soft: '#E6F2EE' },
        teal: { DEFAULT: '#0B5454', dark: '#073B3B', light: '#0E6E6E' },
        gold: { DEFAULT: '#C9A227', light: '#E0BE5A', soft: '#F5EBC8', deep: '#A8851C' },
        ivory: '#FAF7F0',
        cream: '#F4EFE3',
        ink: '#2C2C2C',
        muted: '#6B6B6B',
        mutedLight: '#9A9A9A',
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'sans-serif'],
        display: ['Vazirmatn', 'system-ui', 'sans-serif'],
      },
      borderRadius: { '2xl': '1.25rem', '3xl': '1.75rem' },
      boxShadow: {
        soft: '0 2px 20px -4px rgba(15, 106, 74, 0.08)',
        card: '0 4px 30px -8px rgba(15, 106, 74, 0.12)',
        'card-hover': '0 12px 40px -10px rgba(15, 106, 74, 0.22)',
        gold: '0 2px 20px -4px rgba(201, 162, 39, 0.25)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
