import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import "./styles/common.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Wijwsundara"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-100">
        
        <nav className="w-24 bg-gray-800 text-white p-4 flex flex-col gap-4">
          {[
            { label: "🏠", path: "/financehome" },
            { label: "📊", path: "/financereport" },
            { label: "💳", path: "/Transactions" },
            { label: "⚙️", path: "/settings" },
            { label: "👤", path: "/profile" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.path}
              className="h-12 w-full flex items-center justify-center bg-gray-700 rounded-md hover:bg-gray-600 transition"
            >
              {item.label}
            </a>
          ))}
        </nav>

       
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}

