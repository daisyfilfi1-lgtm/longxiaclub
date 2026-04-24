import type { NextConfig } from "next";

const basePath = (process.env.BASE_PATH ?? "").replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  // 输出模式：standalone 用于 Docker 部署
  output: 'standalone',
  
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
  
  // 环境变量可在构建时使用
  env: {
    SITE_URL: process.env.SITE_URL || 'https://longxiaclub.com',
  },
  
  // 实验性功能
  experimental: {
    // 优化包体积
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
