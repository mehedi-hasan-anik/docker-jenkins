/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Nginx proxies /app/admin/* → http://localhost:7100/admin/*, so the admin app
  // still serves itself under the /admin basePath.
  basePath: process.env.BASE_PATH || "/admin",
  transpilePackages: ["@workspace/ui", "@workspace/shared"],
};

export default nextConfig;
