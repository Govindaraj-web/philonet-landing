import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <div>
        <Helmet>
          {/* Basic SEO */}
          <title>Philonet Landing Page</title>
          <meta
            name="description"
            content="Philonet - AI-powered social networking platform."
          />
          <meta
            name="keywords"
            content="Philonet, AI, Social Networking, Friends App"
          />
          <meta name="author" content="Philonet Team" />
          <meta name="robots" content="index, follow" />

          {/* Mobile */}
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />

          {/* Favicon */}
          <link rel="icon" href="/favicon.ico" />

          {/* Canonical URL */}
          <link rel="canonical" href="https://philonet.com" />

          {/* Open Graph (Facebook, LinkedIn) */}
          <meta property="og:title" content="Philonet Landing Page" />
          <meta
            property="og:description"
            content="Philonet - AI-powered social networking platform."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://philonet.com" />
          <meta
            property="og:image"
            content="https://philonet.com/og-image.jpg"
          />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Philonet Landing Page" />
          <meta
            name="twitter:description"
            content="Philonet - AI-powered social networking platform."
          />
          <meta
            name="twitter:image"
            content="https://philonet.com/twitter-image.jpg"
          />
        </Helmet>

        <h1>Philonet Landing Page</h1>
      </div>
    </HelmetProvider>
  );
}

export default App;
