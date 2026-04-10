import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors (Navy)
        primary: '#00113a',
        'primary-container': '#002366',
        'on-primary': '#ffffff',
        'on-primary-container': '#758dd5',
        'primary-fixed': '#dbe1ff',
        'primary-fixed-dim': '#b3c5ff',
        'on-primary-fixed': '#00174a',
        'on-primary-fixed-variant': '#2a4386',

        // Secondary Colors (Gold)
        secondary: '#735c00',
        'secondary-container': '#fed65b',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#745c00',
        'secondary-fixed': '#ffe088',
        'secondary-fixed-dim': '#e9c349',
        'on-secondary-fixed': '#241a00',
        'on-secondary-fixed-variant': '#574500',

        // Tertiary Colors (Neutrals)
        tertiary: '#131515',
        'tertiary-container': '#272929',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#8f9090',
        'tertiary-fixed': '#e3e2e2',
        'tertiary-fixed-dim': '#c6c6c6',
        'on-tertiary-fixed': '#1a1c1c',
        'on-tertiary-fixed-variant': '#464747',

        // Surface Colors (Hierarchy)
        background: '#f8f9fa',
        'on-background': '#191c1d',
        surface: '#f8f9fa',
        'on-surface': '#191c1d',
        'surface-variant': '#e1e3e4',
        'on-surface-variant': '#444650',
        'surface-bright': '#f8f9fa',
        'surface-container': '#edeeef',
        'surface-container-low': '#f3f4f5',
        'surface-container-high': '#e7e8e9',
        'surface-container-highest': '#e1e3e4',
        'surface-container-lowest': '#ffffff',
        'surface-dim': '#d9dadb',
        'surface-tint': '#435b9f',

        // Inverse Colors
        'inverse-surface': '#2e3132',
        'inverse-on-surface': '#f0f1f2',
        'inverse-primary': '#b3c5ff',

        // Outline & Borders
        outline: '#757682',
        'outline-variant': '#c5c6d2',

        // Error States
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
      },
      fontFamily: {
        // Stitch Design System Font Aliases
        headline: ['Noto Serif', 'serif'],
        body: ['Inter', 'sans-serif'],
        label: ['Inter', 'sans-serif'],
        // Standard aliases
        serif: ['Noto Serif', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem', // 2px
        sm: '0.125rem', // 2px
        lg: '0.25rem', // 4px
        xl: '0.5rem', // 8px
        full: '0.75rem', // 12px
      },
      spacing: {
        20: '5rem',
        24: '6rem',
      },
      backdropBlur: {
        24: '24px',
      },
      boxShadow: {
        // Ambient Shadow (Preferred)
        ambient: '0 12px 48px rgba(25, 28, 29, 0.04)',
        'ambient-lg': '0 20px 50px rgba(25, 28, 29, 0.06)',
      },
      letterSpacing: {
        tighter: '-0.02em',
        widest: '0.3em',
      },
      animation: {
        // Lift effect
        lift: 'lift 200ms ease-out',
        // Fade in
        'fade-in': 'fadeIn 300ms ease-out',
        // Fade up (Stitch style)
        'fade-up': 'fadeUp 800ms cubic-bezier(0.16, 1, 0.3, 1)',
        // Shimmer (Gold Loader)
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        lift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
