import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://checkout.paystack.com https://js.paystack.co; connect-src 'self' https://api.paystack.co https://real-estate-4391.onrender.com;"
          }
        ],
      },
    ];
  },
};

export default nextConfig;
