/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Apps are served behind /app (Nginx strips the prefix and proxies here)
  basePath: process.env.BASE_PATH || "",
  transpilePackages: ["@workspace/ui", "@workspace/shared"],
};

export default nextConfig;
