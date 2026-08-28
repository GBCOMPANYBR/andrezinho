import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://oandrezinho.com.br",
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://oandrezinho.com.br/produtos",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://oandrezinho.com.br/anunciar",
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
