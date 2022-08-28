import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name='application-name' content='Scan A Tree' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Scan A Tree' />
        <meta name='description' content='Improve trees scanning' />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta
          name='msapplication-config'
          content='/assets/icons/browserconfig.xml'
        />
        <meta name='msapplication-TileColor' content='#384F96' />
        <meta name='msapplication-tap-highlight' content='no' />
        <meta name='theme-color' content='#ffffff' />

        <link rel='apple-touch-icon' href='/assets/icons/icon-128x128.png' />
        <link
          rel='apple-touch-icon'
          sizes='152x152'
          href='/assets/icons/icon-128x128.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/assets/icons/icon-128x128.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='167x167'
          href='/assets/icons/icon-128x128.png'
        />

        <link
          rel='icon'
          type='image/png'
          sizes='48x48'
          href='/assets/icons/icon-48x48.png'
        />
        <link rel='manifest' href='/manifest.json' />
        <link
          rel='mask-icon'
          href='/assets/icons/safari-pinned-tab.svg'
          color='#5bbad5'
        />
        <link rel='shortcut icon' href='/favicon.ico' />

        <meta name='twitter:card' content='summary' />
        <meta name='twitter:title' content='Scan A Tree' />
        <meta
          name='twitter:description'
          content='Best Scan A Tree in the world'
        />
        <meta
          name='twitter:image'
          content='https://yourdomain.com/assets/icons/icon-192x192.png'
        />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Scan A Tree' />
        <meta
          property='og:description'
          content='Best Scan A Tree in the world'
        />
        <meta property='og:site_name' content='Scan A Tree' />
        {/* <meta property='og:url' content='https://yourdomain.com' /> */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
