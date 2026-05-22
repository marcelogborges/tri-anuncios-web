import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["f084-2804-14d-4cb8-848f-e7ef-5809-2ff8-a3b1.ngrok-free.app"],
  outputFileTracingRoot: path.join(__dirname, ".."),
  transpilePackages: ["react-native", "react-native-web"],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-native$": "react-native-web",
    };

    return config;
  },
};

export default nextConfig;
