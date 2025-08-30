import type { Metadata } from "next";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Designer Rules Portal",
  description: "Portal aturan & product knowledge",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
        {children}
        {/* floating chatbot di semua halaman */}
        <ChatWidget />
      </body>
    </html>
  );
}
