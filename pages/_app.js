import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

import '../styles/globals.css';

const App = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="prose mx-auto">
        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  );
};

export default App;
