import type { Metadata } from "next";
  import { Inter } from "next/font/google";
  import Navbar from "@/components/Navbar";
  import Footer from "@/components/Footer";
  import "./globals.css";

  const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    preload: true,
  });

  export const metadata: Metadata = {
    title: "FinFlow - Financial Management",
    description: "Manage your finances with FinFlow",
  };

  export default function RootLayout({
    children,
  }: ReadOnly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en" className={inter.className}>
        <body className="bg-background text-foreground">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    );
  }