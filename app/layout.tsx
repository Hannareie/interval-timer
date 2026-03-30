import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  applicationName: "Interval Timer",
  title: "Interval Timer",
  description: "Premium mobile-first interval timer for running training.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Interval Timer"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    apple: [{ url: "/apple-icon" }],
    icon: [{ url: "/icon" }]
  }
};

export const viewport: Viewport = {
  themeColor: "#32d2c5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
