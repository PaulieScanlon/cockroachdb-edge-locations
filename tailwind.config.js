module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        text: '#FCF3E4',
        primary: '#DBD2BD',
        secondary: '#97907e',
        surface: '#121212',
        shade: '#121212',
        background: '#000000',
        border: '#232323',
        table: {
          thead: '#262626',
          tbody: '#1b1b1b',
          divide: '#222222'
        },
        hero: {
          start: '#00ff33',
          end: '#00cc33'
        },
        announce: {
          success: '#00ff33',
          error: '#ff0000',
          loading: '#0033ff'
        }
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
