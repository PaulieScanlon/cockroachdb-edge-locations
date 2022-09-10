module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        text: '#FCF3E4',
        primary: '#DBD2BD',
        secondary: '#666666',
        surface: '#333333',
        background: '#000000'
      },
      gridTemplateColumns: {
        ['1fr-auto']: '1fr auto'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            '*': {
              color: theme('colors.text')
            }
          }
        }
      })
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
