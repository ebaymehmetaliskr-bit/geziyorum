import type { Metadata } from "next";
import "../index.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Geziyorum Türkiye | Akıllı Seyahat Rehberi",
  description: "Türkiye'nin en yenilikçi rotaları, turları ve gizli kalmış mekanları.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased bg-gray-50 text-slate-900">
        <Header />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}