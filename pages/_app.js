import { Fragment } from 'react';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

import '../styles/globals.css';

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  const url = 'https://cockroachdb-edge-locations.vercel.app/';
  const seoTitle = 'Edge';
  const seoDescription = 'Submit the location of your nearest edge.';
  const seoImage = 'edge-open-graph-image.jpg';

  return (
    <Fragment>
      <Head>
        <title>Edge</title>
        <link rel="canonical" href={url} />

        {/* Primary Meta Tags */}
        <meta name="title" content={seoTitle} />
        <meta name="description" content={seoDescription} />
        <meta name="image" content={`${url}${seoImage}`} />

        {/* Open Graph / Facebook  */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={`${url}${seoImage}`} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={`${url}${seoImage}`} />

        {/* favicon */}
        <link rel="icon" type="image/png" sizes="16x16" href={`${url}favicon-16x16.png`} data-react-helmet="true" />
        <link rel="icon" type="image/png" sizes="32x32" href={`${url}favicon-32x32.png`} data-react-helmet="true" />
      </Head>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <main>
            <Component {...pageProps} />
          </main>
        </QueryClientProvider>
      </SessionProvider>
    </Fragment>
  );
};

export default App;
