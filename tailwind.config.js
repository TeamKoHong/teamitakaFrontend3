/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-', // Prevent class name collisions
  corePlugins: {
    preflight: false, // Disable global reset to protect existing CSS
  },
  content: [
    "./src/features/type-test/**/*.{js,jsx,ts,tsx}", // Apply only to new feature
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F76241', // --brand
        bg: '#403E3E',      // --bg
        text: '#FFFFFF',    // --text
        muted: '#B5B5B8',   // --muted
        'dark-card': '#323030', // result-page specific
      }
    },
  },
  plugins: [],
}
