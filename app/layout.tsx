import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WorkingNavigation } from "@/components/layout/working-navigation";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "メンタリングプラットフォーム",
  description: "社内メンタリング支援システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <AuthProvider>
          <WorkingNavigation />
          <main className="flex-1">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
