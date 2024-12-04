/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./frontend/**/*.html', './frontend/**/*.js'],
  theme: {
        extend: {
            fontFamily: {
                heading: ['Orbitron', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
            },
            colors: {
                slateBlue: '#1E293B',
                electricBlue: '#4F46E5',
                lightGray: '#F8FAFC',
            },
        },
    },
  plugins: [],
}

