module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            'code:not(div)': {
              '&::after, &::before': {
                content: '""'
              }
            }
          }
        }
      }),
      textColor: {
        'primary': '#005b99',
        'secondary': '#2e353f',
        'danger': '#e3342f',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}
