import type { Testimonial } from "@/content/corporate-launch";

/**
 * Scales a testimonial photo around an origin chosen so the face point lands in the centre of its
 * circle: a point p scaled by z about origin o ends up at o + z(p - o); solving for 50% gives o.
 */
export function focusStyle(t: Pick<Testimonial, "photoFocus" | "photoZoom">) {
  const z = t.photoZoom ?? 1;
  if (!t.photoFocus || z === 1) return {};
  const origin = t.photoFocus.map((p) => Math.min(100, Math.max(0, (50 - z * p) / (1 - z))));
  return { transform: `scale(${z})`, transformOrigin: `${origin[0]}% ${origin[1]}%` };
}

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
