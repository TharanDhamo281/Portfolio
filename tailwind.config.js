/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'neon-cyan':   '#00e5ff',   // electric cyan (primary)
        'neon-purple': '#aa44ff',   // electric purple (secondary)
        'neon-green':  '#00ff88',   // neon green (accent)
        'neon-pink':   '#ff66cc',   // neon pink
        'dark-bg':     '#06021a',   // deep indigo
        'dark-card':   '#0d0528',   // dark card
        'dark-border': '#1a0855',   // dark border
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'glitch':     'glitch 1s linear infinite',
        'float':      'float 6s ease-in-out infinite',
        'scanline':   'scanline 8s linear infinite',
        'spin-slow':  'spin 20s linear infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 5px #00e5ff, 0 0 10px #00e5ff, 0 0 20px #00e5ff' },
          '50%':      { boxShadow: '0 0 10px #00e5ff, 0 0 25px #00e5ff, 0 0 50px #00e5ff' },
        },
        glitch: {
          '0%':   { clipPath: 'inset(0 0 95% 0)' },
          '20%':  { clipPath: 'inset(30% 0 50% 0)' },
          '40%':  { clipPath: 'inset(60% 0 20% 0)' },
          '60%':  { clipPath: 'inset(80% 0 5%  0)' },
          '80%':  { clipPath: 'inset(10% 0 70% 0)' },
          '100%': { clipPath: 'inset(0 0 95% 0)' },
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
        'cyber-grid': 'linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    },
  },
  plugins: [],
}
