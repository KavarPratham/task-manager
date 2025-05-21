// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.clerk.com'],  // add this line
  },
  // ...any other config you have
};

module.exports = nextConfig;
