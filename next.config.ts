import type { NextConfig } from "next";

const basePath = (process.env.BASE_PATH ?? "").replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  // 使用 SSR 模式以支持 API 路由和动态功能
  // 如需静态导出，请使用: output: "export", distDir: "dist"
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  ...(basePath ? { basePath } : {}),
  
  // 环境变量可在构建时使用
  env: {
    SITE_URL: process.env.SITE_URL || 'https://longxiaclub.com',
  },
};

export default nextConfig;
