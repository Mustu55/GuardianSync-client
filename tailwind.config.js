/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: 'rgb(var(--cyber-bg) / <alpha-value>)',
          surface: 'rgb(var(--cyber-surface) / <alpha-value>)',
          card: 'rgb(var(--cyber-card) / <alpha-value>)',
          border: 'rgb(var(--cyber-border) / <alpha-value>)',
          glow: 'rgb(var(--cyber-glow) / <alpha-value>)',
          accent: 'rgb(var(--cyber-accent) / <alpha-value>)',
          success: 'rgb(var(--cyber-success) / <alpha-value>)',
          warning: 'rgb(var(--cyber-warning) / <alpha-value>)',
          danger: 'rgb(var(--cyber-danger) / <alpha-value>)',
          critical: 'rgb(var(--cyber-critical) / <alpha-value>)',
          muted: 'rgb(var(--cyber-muted) / <alpha-value>)',
          text: 'rgb(var(--cyber-text) / <alpha-value>)',
          'text-dim': 'rgb(var(--cyber-text-dim) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(6, 182, 212, 0.3)',
        'glow-lg': '0 0 30px rgba(6, 182, 212, 0.4)',
        'glow-danger': '0 0 20px rgba(239, 68, 68, 0.4)',
        'glow-success': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan-line': 'scanLine 3s linear infinite',
        'data-flow': 'dataFlow 2s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(6,182,212,0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(6,182,212,0.6)' },
        },
        scanLine: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        dataFlow: {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
