import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // TODO: Re-enable after fixing all route references
  // typedRoutes: true,

  // Allow external images from any HTTPS source (for collaborator logos, etc.)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Optimize logging for reduced output
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  // Webpack optimization for minimal build output
  webpack: (config, { isServer, dev }) => {
    if (!dev) {
      config.stats = 'errors-only';
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
