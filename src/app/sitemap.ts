import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  return [
    "",
    "/about",
    "/features",
    "/services",
    "/pricing",
    "/contact",
    "/privacy",
    "/terms",
    "/login",
    "/signup",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "monthly",
    priority:
      path === "" ? 1 : path === "/services" || path === "/pricing" ? 0.8 : 0.6,
  }));
}
