import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import "./globals.css";

const basePath = process.env.NODE_ENV === "production" ? "/interval-timer" : "";

export const metadata: Metadata = {
  applicationName: "Interval Timer",
  title: "Interval Timer",
  description: "Premium mobile-first interval timer for running training.",
  manifest: `${basePath}/manifest.webmanifest`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Interval Timer"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    apple: [{ url: `${basePath}/apple-icon` }],
    icon: [{ url: `${basePath}/icon` }]
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
      <body>{children}</body>
    </html>
  );
}
