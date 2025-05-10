import * as cheerio from "cheerio";
import encoding from "encoding-japanese";
import fs from "fs";
import { z } from "zod";

const goodsSchema = z.object({
  goodsId: z.number(),
  goodsTypeName: z.string(),
  goodsName: z.string(),
  goodsUrl: z.string(),
  goodsImage215Url: z.string(),
  goodsImageUrl: z.string(),
  goodsImageAlt: z.string(),
  properPrice: z.string(),
  salePrice: z.string(),
  brandName: z.string(),
  brandNameJp: z.string(),
  isSoldOut: z.boolean(),
  colorId: z.number(),
  colorName: z.string(),
  goodsDetailId: z.number(),
});

const goodsCatalogContentsSchema = z.object({
  goods: z.array(goodsSchema),
});

const pagePropsSchema = z.object({
  pageProps: z.object({
    goodsCatalogContents: goodsCatalogContentsSchema.optional(),
  }),
});

const apiResponseSchema = z.object({
  props: pagePropsSchema,
});

export const productSchema = z.object({
  goodsId: z.number(),
  name: z.string(),
  price: z.string(),
  image: z.string(),
  image215: z.string(),
  url: z.string(),
  brand: z.string(),
  brandJp: z.string(),
  isSoldOut: z.boolean(),
  colorId: z.number(),
  colorName: z.string(),
  goodsDetailId: z.number(),
});

export type Product = z.infer<typeof productSchema>;

function getUrl(category: string): string {
  const unicodeArray = [];
  for (let i = 0; i < category.length; i++) {
    unicodeArray.push(category.charCodeAt(i));
  }
  const sjisArray = encoding.convert(unicodeArray, { to: "SJIS", from: "UNICODE" });
  const encodedCategory = encoding.urlEncode(sjisArray);
  console.log("encoded", encodedCategory);
  return `https://zozo.jp/search/?p_keyv=${encodedCategory}`;
}

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "ja,en-US;q=0.7,en;q=0.3",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Cache-Control": "max-age=0",
};

export const searchProducts = async ({ query }: { query: string }): Promise<Product[]> => {
  const url = getUrl(query);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    console.log("url", url);
    const response = await fetch(url, {
      headers,
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);
    const nextDataScript = $("script#__NEXT_DATA__").html();

    if (!nextDataScript) {
      throw new Error("Next.js data not found");
    }

    const nextData = JSON.parse(nextDataScript.trim());
    console.log(nextData);
    fs.writeFileSync("result.json", JSON.stringify(nextData, null, 2));

    const validationResult = apiResponseSchema.safeParse(nextData);
    if (!validationResult.success) {
      console.error("API response validation error:", validationResult.error);
      return [];
    }

    const validatedData = validationResult.data;

    if (!validatedData.props.pageProps.goodsCatalogContents) {
      console.error("No goods catalog contents found");
      return [];
    }

    const goodsList = validatedData.props.pageProps.goodsCatalogContents.goods;

    const products = goodsList.map((item) => {
      return {
        goodsId: item.goodsId,
        goodsDetailId: item.goodsDetailId,
        name: item.goodsName,
        price: item.salePrice,
        image: item.goodsImageUrl,
        image215: item.goodsImage215Url,
        url: item.goodsUrl,
        brand: item.brandName,
        brandJp: item.brandNameJp,
        isSoldOut: item.isSoldOut,
        colorId: item.colorId,
        colorName: item.colorName,
      };
    });

    const productsValidation = z.array(productSchema).safeParse(products);
    if (!productsValidation.success) {
      console.error("Products validation error:", productsValidation.error);
      return [];
    }

    console.log(productsValidation.data);
    return productsValidation.data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error("Request timed out");
      } else {
        console.error(`Error: ${error.message}`);
      }
    } else {
      console.error("An unexpected error occurred");
    }
    return [];
  }
};
