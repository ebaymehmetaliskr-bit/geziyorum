/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.geziyorumturkiye.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ],
  },
  // Derleme sırasında TypeScript ve ESLint hatalarını görmezden gelmesi için:
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;