"use client"

import { Roboto } from 'next/font/google'
import { Provider } from "react-redux"
import { store } from "@/rtk/store"

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})

export default function AuthLayout({ children }) {
  return (
    <Provider store={store}>
    <html lang="en">
      <body className={roboto.className}>{children}</body>
    </html>
    </Provider>
  );
}


