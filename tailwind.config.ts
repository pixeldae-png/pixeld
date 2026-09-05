import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0c0f',
        paper: '#ffffff',
        mist: '#6b7280',
        line: '#e7e7ea',
        accent: {
          DEFAULT: '#7c6cf2',
          coral: '#ff6b4a',
          teal: '#3ec9b0',
          violet: '#7c6cf2',
          sky: '#4f8ef7',
          lime: '#b8d94a',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      screens: {
        xs: '420px',
      },
    },
  },
  plugins: [],
} satisfies Config
