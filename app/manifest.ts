import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const basePath = process.env.NODE_ENV === "production" ? "/interval-timer" : "";

  return {
    name: "Interval Timer",
    short_name: "Interval",
    description: "Premium running interval timer.",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#07161d",
    theme_color: "#32d2c5",
    orientation: "portrait",
    icons: [
      {
        src: `${basePath}/icons/icon-192.svg`,
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable"
      },
      {
        src: `${basePath}/icons/icon-512.svg`,
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
