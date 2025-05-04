// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          800: '#1E40AF',
        },
        accent: '#F59E0B',
        'grid-light': 'rgba(255,255,255,0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
