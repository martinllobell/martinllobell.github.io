import type { NextConfig } from "next";

// Static export for GitHub Pages (user site, so no basePath).
const config: NextConfig = { output: "export" };

export default config;
