'use client';

import Navbar from './components/Navbar';
import '../globals.css';

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}