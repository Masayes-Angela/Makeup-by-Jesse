// app/admin/layout.js
'use client';

import Sidebar from '@/app/admin/components/Sidebar';
import { Provider } from 'react-redux';
import { store } from '@/rtk/store';
import '../globals.css';

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <div className="app">
            <Sidebar />
            <main className="main-content">{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}