import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    /*
     * Paper breakpoints. md/lg match Tailwind's defaults; xl is 1440 because
     * that is the width every desktop artboard was designed at.
     */
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
    },
    extend: {
      /*
       * Type scale from the Paper file. The second value is the default line
       * height — override per component when a design calls for it.
       */
      fontSize: {
        xs: ['13px', '18px'],
        sm: ['15px', '20px'],
        base: ['17px', '26px'],
        lg: ['22px', '28px'],
        xl: ['34px', '38px'],
        '2xl': ['56px', '58px'],
      },
      letterSpacing: {
        tight: '-0.03em',
        normal: '0em',
        caps: '0.12em',
      },
      fontFamily: {
        // Inter Tight — headings and the wordmark.
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        // Body copy. The prototype uses the system stack, not a webfont.
        sans: ['system-ui', 'sans-serif'],
      },
      colors: {
        DEFAULT: 'hsl(var(--background))',
        background: {
          DEFAULT: 'hsl(var(--background))',
          darker: 'hsl(var(--background-darker))',
        },
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        separator: 'hsl(var(--separator))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Dark surfaces inside the light theme — subscription card, closing
        // CTA band, instructor navigation.
        'surface-dark': {
          DEFAULT: 'hsl(var(--surface-dark))',
          foreground: 'hsl(var(--surface-dark-foreground))',
          muted: 'hsl(var(--surface-dark-muted))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      // Paper radius scale. Explicit values instead of the shadcn
      // calc(--radius) chain, which cannot express 6/10/16.
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
        full: '999px',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}
export default config
