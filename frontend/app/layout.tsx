import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Noto_Sans } from "next/font/google";

import "./globals.css";

const GeistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const GeistMono = Geist_Mono({
  variable: "--font-geist-mono",
  display: "swap",
  subsets: ["latin"],
});

const NotoSans = Noto_Sans({
  variable: "--font-noto-sans",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "star.stylla.moe",
  description: "Honkai Star Rail Assistance Website",
  icons: {
    icon: "/tabicon.png",
  },
};

//

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${NotoSans.variable} ${GeistSans.variable} ${GeistMono.variable} antialiased `}>
        <div className='rounded-lg bg-[#0d0d0d]'>{children}</div>
      </body>
    </html>
  );
}
