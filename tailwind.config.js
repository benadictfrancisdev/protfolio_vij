/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        elevated: 'var(--elevated)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        ivory: '#f3f0ea',
        mist: '#e7e2d8',
        charcoal: '#121212',
        ink: '#0c0c0c',
        olive: '#6f7a3a',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Oswald', 'Impact', 'sans-serif'],
        sans: ['"Manrope"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: {
        shell: '1400px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
}
