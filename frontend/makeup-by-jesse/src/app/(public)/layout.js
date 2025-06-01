import '../globals.css';
import NavTop from './components/Navbar';
import Footer from './components/Footer';
import { Source_Sans_3 } from 'next/font/google';
import { Courgette } from 'next/font/google';

export const metadata = {
  title: 'Makeup by Jesse',
  description: 'A Glam Experience Like No Other',
  icons: {
    icon: '/favicon.png',
  },
};

const courgette = Courgette({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-courgette',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-source-sans',
});

export default function PublicLayout({ children }) {
  return (
    <html lang="en" className={sourceSans.variable}>
      <body>
        <NavTop />
        {children}
        <Footer />
      </body>
    </html>
  );
}