const repoName = "interval-timer";
const isProduction = process.env.NODE_ENV === "production";
const basePath = isProduction ? `/${repoName}` : "";

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

export default nextConfig;
