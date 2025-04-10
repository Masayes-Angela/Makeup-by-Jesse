  import Sidebar from "@/components/Sidebar";
  import "./globals.css";

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          <div className="app">
            <Sidebar />
            <main className="main-content">{children}</main>
          </div>
        </body>
      </html>
    );
  }