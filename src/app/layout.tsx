import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Chatbot",
};

export default function RootLayout({ children }: child) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
