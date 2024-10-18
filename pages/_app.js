import Head from 'next/head';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import NavBar from '../components/NavBar';

function MyApp({ Component, pageProps, router }) {
  const showLogout = router.pathname === '/home';

  return (
    <AuthProvider>
      <Head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300&display=swap" rel="stylesheet"/>
      </Head>
      <NavBar showLogout={showLogout} />
      <div className="pt-16">
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}

export default MyApp;
