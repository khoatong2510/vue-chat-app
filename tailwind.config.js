/** @type {import('tailwindcss').Config} */
import { argbFromHex, hexFromArgb, SchemeContent, themeFromSourceColor, Hct, MaterialDynamicColors, DynamicScheme, TonalPalette } from '@material/material-color-utilities'
const primary = argbFromHex('#97D5BC')
const secondary = argbFromHex('#728051')
const tertiary = argbFromHex('#AFB3A6')
const neutral = argbFromHex('#5B6463')
const neutralVariant = argbFromHex('#191C1E')

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
  sourceColorArgb: primary,
  variant: Variant.TONAL_SPOT,
  isDark: false,
  contrastLevel: 0.1,
  primaryPalette: TonalPalette.fromInt(primary),
  secondaryPalette: TonalPalette.fromInt(secondary),
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

