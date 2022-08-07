/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/authenticate/authenticate.component.{html,ts}",
    "./src/app/landing-page/landing-page.component.{html,ts}",
    "./src/app/landing-page/navbar.component.{html,ts}",
    "./src/app/details-page/details.component.{html,ts}"
  ],
  theme: {
    extend: {
      backgroundImage:{
        'money':"url(assets/money.jpg)"
      },
      colors:{
        'royalBlue':'#00539CFF',
        'peach':'#EEA47FFF'
      }
    },
  },
  plugins: [],
}
