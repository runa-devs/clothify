import { searchProducts } from "@/lib/scraper";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const catalogSchema = z.object({
  query: z.string(),
  pages: z.number().optional(),
});

export const catalogRoute = new Hono().get("/", zValidator("query", catalogSchema), async (c) => {
  const { query, pages } = c.req.valid("query");
  const params: { query: string; pages?: number } = { query };
  if (pages) params.pages = Number(pages);
  const products = await searchProducts(params);
  return c.json({ products });
});
