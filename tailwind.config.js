/** @type {import('tailwindcss').Config} */
module.exports = {
  // Isso diz ao Tailwind para 'observar' todos os arquivos .js, .ts, .jsx, e .tsx
  // dentro das pastas 'pages' e 'components' (se você a tivesse).
  // É assim que ele sabe quais classes de utilitário incluir no CSS final.
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // Se você usa o App Router (não usamos aqui), você adicionaria './app/**/...'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}