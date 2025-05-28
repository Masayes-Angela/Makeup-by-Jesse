import '../globals.css'
import NavTop from './components/Navbar'
import Footer from './components/Footer'
import { Source_Sans_3 } from 'next/font/google'

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  display: 'swap',
  variable: '--font-source-sans'
})

export default function PublicLayout({ children }) {
  return (
    <html lang="en" className={sourceSans.variable}>
      <body>
        <NavTop />
        {children}
        <Footer />
      </body>
    </html>
  )
}