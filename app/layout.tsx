import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import FloatingAssistant from "@/components/FloatingAssistant";
import { SiteProvider } from "@/components/SiteProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mükellef Dostu",
  description: "Vergi, Bağ-Kur ve şirket kuruluşu için güncel bilgi ve hesaplama araçları.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteProvider>
          {children}
          <FloatingAssistant />
          <Analytics />
        </SiteProvider>
      </body>
    </html>
  );
}
