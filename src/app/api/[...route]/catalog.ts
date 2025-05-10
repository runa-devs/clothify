import { searchProducts } from "@/lib/scraper";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const catalogSchema = z.object({
  query: z.string(),
  pages: z.number().optional(),
});

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "ja,en-US;q=0.7,en;q=0.3",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Cache-Control": "max-age=0",
};

const getImage = async (url: string) => {
  const res = await fetch(url, { headers });
  const blob = await res.blob();
  console.log("blob", blob.size);
  return blob;
};

export const catalogRoute = new Hono()
  .get("/", zValidator("query", catalogSchema), async (c) => {
    const { query, pages } = c.req.valid("query");
    const params: { query: string; pages?: number } = { query };
    if (pages) params.pages = Number(pages);
    const products = await searchProducts(params);
    return c.json({ products });
  })
  .get(
    "/image",
    zValidator(
      "query",
      z.object({
        url: z.string().url(),
      })
    ),
    async (c) => {
      const { url } = c.req.valid("query");
      const image = await getImage(url);
      c.res.headers.set("Content-Type", "image/jpeg");
      return c.body(await image.arrayBuffer());
    }
  );
