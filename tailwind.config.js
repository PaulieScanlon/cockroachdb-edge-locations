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
        border: '#2b2b2b',
        thead: '#262626',
        tbody: '#1b1b1b',
        divide: '#222222',
        location: '#00ff33',
        cluster: '#0496ff',
        serverless: '#dc3545',
        lambda: '#f69402',
        current: '#f7f702'
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
  plugins: [
    require('@tailwindcss/typography'),
    // https://gist.github.com/Merott/d2a19b32db07565e94f10d13d11a8574
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = '') {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === 'string'
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ':root': extractColorVars(theme('colors'))
      });
    }
  ]
};
