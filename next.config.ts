import type { NextConfig } from "next";

/**
 * Placeholder content (testimonials, learner photos, "just enrolled" popups) is ON by default,
 * in development and on the deployed site, so the pages can be reviewed as designed.
 *
 * To go live with real content, set HIDE_SAMPLE_CONTENT=true on the production build (Vercel: Settings,
 * Environment Variables). The placeholders are then stripped from the build, their photo files are
 * refused, and the site becomes indexable. Until then, every page carries a "noindex" header so
 * search engines do not pick up the placeholder text.
 *
 * The value is resolved here and inlined as SAMPLE_CONTENT, so the bundler can drop the placeholder
 * data entirely when it is hidden (see SAMPLES_ON in src/content/*.ts).
 */
const samplesOn = process.env.HIDE_SAMPLE_CONTENT !== "true";
const reviewSite = process.env.NODE_ENV === "production" && samplesOn;

const nextConfig: NextConfig = {
  env: { SAMPLE_CONTENT: samplesOn ? "on" : "off" },

  async rewrites() {
    return {
      // beforeFiles so this wins over the static file in /public
      beforeFiles: samplesOn ? [] : [{ source: "/testimonials/:path*", destination: "/_placeholder-assets-hidden" }],
      afterFiles: [],
      fallback: [],
    };
  },

  // A site that still shows placeholders must not be indexed by search engines.
  async headers() {
    return reviewSite ? [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }] : [];
  },

  // With placeholders hidden, the image optimiser must not fetch their photo files internally either.
  images: samplesOn
    ? undefined
    : {
        localPatterns: [
          { pathname: "/college/**" },
          { pathname: "/faculty/**" },
          { pathname: "/hero/**" },
          { pathname: "/logos/**" },
        ],
      },
};

export default nextConfig;
