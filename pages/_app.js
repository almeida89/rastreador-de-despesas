// Este arquivo 'envolve' todas as nossas páginas.
// A única coisa que precisamos fazer aqui é importar os estilos globais.
// O Next.js já faz isso por padrão, então apenas verifique se ele está assim.
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}