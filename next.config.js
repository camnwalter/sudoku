const withPwa = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/play",
        permanent: true,
      },
    ];
  },
  distDir: "build",
};

module.exports = withPwa(nextConfig);
