/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fifa: {
          dark: '#030712',      // Deep pitch black/blue
          navy: '#081229',      // Dark base
          card: '#0c1d3c',      // FIFA broadcast card background
          cardLight: '#162e5c', // Lighter details
          blue: '#0055ff',      // FIFA core blue
          accent: '#10b981',    // Football green pitch accent
          gold: '#eab308',      // Gold trophy accent
          goldGlow: '#d4af37',  // Shiny gold
          grass: '#0f5132',     // Green grass main
          grassLight: '#198754',// Green grass highlight
          neon: '#00ff66',      // AURA neon green
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 15px rgba(0, 255, 102, 0.3)',
        'glow-gold': '0 0 15px rgba(234, 179, 8, 0.3)',
        'glow-blue': '0 0 15px rgba(0, 87, 255, 0.3)',
        'glow-neon': '0 0 25px rgba(0, 255, 102, 0.5)',
      }
    },
  },
  plugins: [],
}
