// app/admin/layout.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/admin/components/Sidebar';
import { Provider } from 'react-redux';
import { store } from '@/rtk/store';
import '../globals.css';

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/auth/login'); // updated route
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <div className="app" style={{ backgroundColor: '#F6FAFF' }}>
            <Sidebar />
            <main className="main-content">{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}