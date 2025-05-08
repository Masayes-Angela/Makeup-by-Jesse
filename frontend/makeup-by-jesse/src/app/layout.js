import './public.css';
import Navbar from './components/Navbar'

export const metadata = {
  title: 'Makeup by Jesse',
  description: 'Hair & Makeup Artist Portfolio and Booking Site',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
