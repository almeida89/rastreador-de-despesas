/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Esta é a configuração CORRETA para o Tailwind v3
    'tailwindcss': {},
    'autoprefixer': {},
  },
};

export default config;