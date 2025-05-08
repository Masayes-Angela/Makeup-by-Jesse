// app/layout.js
export const metadata = {
    title: 'Makeup by Jesse',
    description: 'Hair and Makeup Artist Services',
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>{children}</body>
      </html>
    );
  }  