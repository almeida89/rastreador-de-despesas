/** @type {import('tailwindcss').Config} */
module.exports = {
  // ESTA é a parte crucial que estava faltando:
  content: [
    // Diz ao Tailwind para escanear todos os arquivos .js/.jsx/.ts/.tsx
    // dentro da pasta 'pages'
    './pages/**/*.{js,ts,jsx,tsx}',

    // Faremos o mesmo para a pasta 'components', caso você a crie no futuro
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}