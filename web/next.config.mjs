/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow unoptimized local SVGs
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
