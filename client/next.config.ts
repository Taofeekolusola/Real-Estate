import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://checkout.paystack.com https://js.paystack.co;"
          }
        ],
      },
    ];
  },
};

export default nextConfig;
