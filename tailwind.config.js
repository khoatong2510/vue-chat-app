/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      sans: [
        "Poppins", 'sans-serif'
      ],
      serif: [
        "Merriweather", 'serif'
      ],
      mono: [
        "Anonymous Pro",
        "Courier New"
      ]
    }
  },
  plugins: [],
}

