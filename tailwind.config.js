/** @type {import('tailwindcss').Config} */
import { argbFromHex, hexFromArgb, SchemeContent, themeFromSourceColor, Hct, MaterialDynamicColors, DynamicScheme, TonalPalette } from '@material/material-color-utilities'
const primary = argbFromHex('#d26470')
const secondary = argbFromHex('#fb9b63')
const tertiary = argbFromHex('#f9b3b3')
const neutral = argbFromHex('#e9e9e9')
const neutralVariant = argbFromHex('#8c8c99')

const Variant = {
  MONOCHROME: 0,
  NEUTRAL: 1,
  TONAL_SPOT: 2,
  VIBRANT: 3,
  EXPRESSIVE: 4,
  FIDELITY: 5,
  CONTENT: 6,
  RAINBOW: 7,
  FRUIT_SALAD: 8
}

const scheme = new DynamicScheme({
  sourceColorArgb: secondary,
  variant: Variant.TONAL_SPOT,
  isDark: false,
  contrastLevel: 0.0,
  primaryPalette: TonalPalette.fromInt(secondary),
  secondaryPalette: TonalPalette.fromInt(primary),
  tertiaryPalette: TonalPalette.fromInt(tertiary),
  neutralPalette: TonalPalette.fromInt(neutral),
  neutralVariantPalette: TonalPalette.fromInt(neutralVariant)
})

let myCustomTheme = {}
for (const key of Object.keys(MaterialDynamicColors)) {
  if (key === 'contentAccentToneDelta' || key === 'highestSurface')
    continue
  const hex = hexFromArgb(MaterialDynamicColors[key].getArgb(scheme))
  myCustomTheme[key] = hex
}


const theme = themeFromSourceColor(primary)

let lightScheme = theme.schemes.light.props

for (const key of Object.keys(lightScheme)) {
  lightScheme[key] = hexFromArgb(lightScheme[key])
}


export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    colors: {
      ...myCustomTheme
    },
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

