import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["16f4-143-54-78-136.ngrok-free.app"],
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
