// app/layout.js
import '../globals.css';
import NavTop from './components/Navbar';
import Footer from './components/Footer';

export default function PublicLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavTop />
        {children}
        <Footer />
      </body>
    </html>
  );
}