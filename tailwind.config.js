/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-cyan':   '#ff1a1a',   // electric red (primary)
        'neon-purple': '#cc2200',   // crimson (secondary)
        'neon-green':  '#ff4400',   // fire orange (accent)
        'neon-pink':   '#880000',   // blood red
        'dark-bg':     '#020000',   // deep black
        'dark-card':   '#0e0000',   // dark card
        'dark-border': '#280000',   // dark border
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'glitch': 'glitch 1s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 5px #ff1a1a, 0 0 10px #ff1a1a, 0 0 20px #ff1a1a' },
          '50%':       { boxShadow: '0 0 10px #ff1a1a, 0 0 25px #ff1a1a, 0 0 50px #ff1a1a' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        scanline: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
      backgroundImage: {
        'cyber-grid': 'linear-gradient(rgba(255,26,26,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,26,26,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
}
