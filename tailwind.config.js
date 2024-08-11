/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
    fontFamily: {
      sans: [
        "Lato", 'sans-serif'
      ],
      serif: [
        "Merriweather", 'serif'
      ],
      mono: [
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"'
      ]
    }
  },
  plugins: [],
}

