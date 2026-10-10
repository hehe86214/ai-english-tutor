import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_TC, Nunito } from "next/font/google";
import "./globals.css";

// 英文：圓潤、有份量的 Nunito
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

// 中文字型檔很大，不預載，交給瀏覽器依需要下載
const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  weight: ["400", "500", "700", "900"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI 英文家教",
  description: "CEFR 系統化教材 + AI 老師一對一，隨時開口練英文，看文法糾正和更好的說法。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="zh-Hant"
      className={`${nunito.variable} ${notoSansTC.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        {children}
      </body>
    </html>
  );
}
