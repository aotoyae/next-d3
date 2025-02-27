import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'peak-50': '#f8f2ff',
        'peak-100': '#efe0ff',
        'peak-200': '#e3caff',
        'peak-300': '#cfa7fa',
        'peak-400': '#b77df4',
        'peak-500': '#a24bff',
        'peak-600': '#841af6',
        'peak-700': '#690fc9',
        'peak-800': '#4d039d',
        'peak-900': '#420c7c',
        'peak-950': '#340b60',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        ':root': {
          '--peak-50': '#f8f2ff',
          '--peak-100': '#efe0ff',
          '--peak-200': '#e3caff',
          '--peak-300': '#cfa7fa',
          '--peak-400': '#b77df4',
          '--peak-500': '#a24bff',
          '--peak-600': '#841af6',
          '--peak-700': '#690fc9',
          '--peak-800': '#4d039d',
          '--peak-900': '#420c7c',
          '--peak-950': '#340b60',
        },
      });
    }),
  ],
} satisfies Config;
