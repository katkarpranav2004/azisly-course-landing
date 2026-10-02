import type { NextConfig } from "next";

/**
 * Placeholder learner photos live in /public/testimonials for the development preview only.
 * The pages never show them in production (see SHOW_SAMPLES), so also refuse to serve the files,
 * otherwise anyone could fetch them by typing the address. Same rule as the placeholder data: development only.
 */
const hidePlaceholderAssets = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // beforeFiles so this wins over the static file in /public
      beforeFiles: hidePlaceholderAssets ? [{ source: "/testimonials/:path*", destination: "/_placeholder-assets-hidden" }] : [],
      afterFiles: [],
      fallback: [],
    };
  },
  // The image optimiser would otherwise fetch the same files internally
  images: hidePlaceholderAssets
    ? {
        localPatterns: [
          { pathname: "/college/**" },
          { pathname: "/faculty/**" },
          { pathname: "/hero/**" },
          { pathname: "/logos/**" },
        ],
      }
    : undefined,
};

export default nextConfig;
