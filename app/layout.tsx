import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sit With Me",
  description: "Restoring dignity to people experiencing homelessness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Place it here. It will stay fixed above all page content. */}
        <Navbar />
        
        {/* 'children' represents the specific page you are visiting (e.g., Home, About) */}
        {children}
      </body>
    </html>
  );
}