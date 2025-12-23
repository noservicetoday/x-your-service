import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "X你的！服務 | 全台首創情緒粉碎系統",
  description: "專為台灣人開發。從廟會喧囂到菜市場日常，在此粉碎不爽，同步雲端能量。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className={`${inter.className} bg-black text-white selection:bg-red-600/50`}>{children}</body>
    </html>
  );
}