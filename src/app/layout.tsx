// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Tektur } from "next/font/google"; // 1. Import Tektur
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import { Providers } from "./providers";

// Setup Clearface (Local)
const clearface = localFont({
  src: "./fonts/ClearfaceGothicRoman.woff2",
  variable: "--font-clearface",
  display: "swap",
});

// 2. Setup Tektur (Google Variable Font)
const tektur = Tektur({
  subsets: ["latin"],
  variable: "--font-tektur", // New CSS variable
  display: "swap",
  // No need to specify weights; Tektur is a variable font by default!
});

export const metadata: Metadata = {
  title: "Arsenal Hub",
  description: "The latest news and stats for Arsenal FC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // 3. Add tektur.variable to the class list
        className={`flex flex-col min-h-screen ${clearface.variable} ${tektur.variable} font-sans antialiased`}
      >
        <Providers>
          <Navbar/>
          <main className="flex flex-col min-h-0 flex-1 bg-slate-200">
            {children}
          </main>
          <footer className="bg-slate-700 text-white py-4">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; 2026 Will Worrell</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
