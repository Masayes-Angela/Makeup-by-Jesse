// src/app/layout.js
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'Makeup by Jesse',
  description: 'Hair and Makeup Services for Special Occasions',
};

export default function PublicLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}