import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["e96d-2804-14d-4cb8-848f-7bb0-88d-1c5a-1afb.ngrok-free.app"],
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
