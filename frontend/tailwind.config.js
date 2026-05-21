/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        surface: {
          0: '#080e0b',
          1: '#0f1a12',
          2: '#162419',
          3: '#1d3322'
        },
        accent: {
          DEFAULT: '#22c55e',
          dim: '#16a34a',
          muted: '#166534'
        },
        text: {
          1: '#f0fdf4',
          2: '#bbf7d0',
          3: '#86efac',
          4: '#4ade80',
        }
      },
      animation: {
        'step-reveal': 'stepReveal 0.25s ease-out forwards',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'thinking': 'thinking 1.4s ease-in-out infinite',
      },
      keyframes: {
        stepReveal: {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        thinking: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.3' },
          '40%': { transform: 'scale(1.0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}