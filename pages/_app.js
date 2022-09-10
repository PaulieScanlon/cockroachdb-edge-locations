import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

import '../styles/globals.css';

const App = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="p-4">
        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  );
};

export default App;
