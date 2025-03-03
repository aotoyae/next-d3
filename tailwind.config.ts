import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

export default {
    darkMode: ['class'],
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
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
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
      require("tailwindcss-animate")
],
} satisfies Config;
