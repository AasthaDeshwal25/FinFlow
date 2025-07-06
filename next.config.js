/** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     experimental: {
       optimizeCss: false, // Disable CSS optimization to avoid preload issues
     },
   };

   module.exports = nextConfig;