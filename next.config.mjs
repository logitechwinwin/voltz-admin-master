/** @type {import('next').NextConfig} */
const nextConfig = {
  // distDir: 'dist',
  eslint: {
    ignoreDuringBuilds: true,
  },

  // experimental: {
  //   missingSuspenseWithCSRBailout: false,
  // },
  reactStrictMode: false,
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        // hostname: "*",
        hostname: "s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "voltzbucket1.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/ngo/update-event/:eventId",
        destination: "/ngo/create-event/:eventId",
      },
      {
        source: "/ngo/update-event/:eventId",
        destination: "/ngo/create-event/:eventId",
      },
      {
        source: "/ngo/update-fundraising/:eventId",
        destination: "/ngo/create-fundraising/:eventId",
      },

      {
        source: "/company/update-deal/:dealId",
        destination: "/company/create-deal/:dealId",
      },
      {
        source: "/company/transaction-history",
        destination: "/admin/company-transaction",
      },
      {
        source: "/ngo/update-campaign-manager",
        destination: "/ngo/add-campaign-manager",
      },
      {
        source: "/ngo/transaction-history",
        destination: "/admin/ngo-transaction",
      },
      {
        source: "/admin/update-profile",
        destination: "/admin/create-admin",
      },
      {
        source: "/admin/volunteers-request",
        destination: "/ngo/volunteers-request",
      },
      {
        source: "/admin/events",
        destination: "/ngo/events",
      },
      {
        source: "/admin/ngo-kyc",
        destination: "/ngo-kyc",
      },
      {
        source: "/admin/company-kyc",
        destination: "/company-kyc",
      },
      {
        source: "/admin/notifications",
        destination: "/notification",
      },
      {
        source: "/ngo/notifications",
        destination: "/notification",
      },
      {
        source: "/company/notifications",
        destination: "/notification",
      },
      {
        source: "/admin/company/dashboard",
        destination: "/company/dashboard",
      },
      {
        source: "/admin/ngo/dashboard",
        destination: "/ngo/dashboard",
      },
    ];
  },
};

export default nextConfig;
