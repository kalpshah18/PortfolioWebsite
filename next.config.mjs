/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow unoptimized images if deploying statically or using remote URLs
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
