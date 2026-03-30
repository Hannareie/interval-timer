import withPWAInit from "next-pwa";

const repoName = "interval-timer";
const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? `/${repoName}` : "";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  outputFileTracingRoot: process.cwd()
};

export default withPWA(nextConfig);
