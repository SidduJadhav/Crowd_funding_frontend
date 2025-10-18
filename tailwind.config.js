/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme backgrounds
        'dark-bg': '#0d1117',
        'dark-bg-secondary': '#161b22',
        'dark-bg-tertiary': '#21262d',
        
        // Accent colors
        'accent-purple': '#a371f7',
        'accent-purple-hover': '#923cc5',
        
        // Text colors
        'text-primary': '#e6edf3',
        'text-secondary': '#8b949e',
        'text-tertiary': '#6e7681',
        
        // Status colors
        'status-success': '#26a641',
        'status-error': '#da3633',
        'status-warning': '#fb8500',
        'status-info': '#0969da',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'sans-serif'],
      },
      spacing: {
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '32px',
        xl: '40px',
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
}