import { env } from "@/env/server";
import { auth } from "@/lib/auth";
import { padClothesToSelfieAspect } from "@/lib/image-aspect";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/s3";
import { productSchema } from "@/lib/scraper";
import { generateImage } from "@/lib/try-on";
import { zValidator } from "@hono/zod-validator";
import { Buffer } from "buffer";
import { Hono } from "hono";
import { nanoid } from "nanoid";
import { File } from "node:buffer";
import { z } from "zod";

const tryOnSchema = z.object({
  selfie: z.instanceof(File, { message: "自撮り写真が必要です" }),
  costume: z.instanceof(File, { message: "衣服の画像が必要です" }),
  item: productSchema.optional(),
});

export const tryOnRoute = new Hono().post(
  "/",
  zValidator("form", tryOnSchema, (result, c) => {
    if (!result.success) {
      return c.json({ success: false, errors: result.error.format() }, { status: 400 });
    }
  }),
  async (c) => {
    const session = await auth();
    if (!session) {
      return c.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const { selfie, costume, item } = c.req.valid("form");

    try {
      const jobId = nanoid();
      const selfieBase64 = Buffer.from(await selfie.arrayBuffer()).toString("base64");
      const costumeBase64Raw = Buffer.from(await costume.arrayBuffer()).toString("base64");

      // Normalize clothes image to match selfie aspect ratio
      const costumeBase64 = await padClothesToSelfieAspect(selfieBase64, costumeBase64Raw, {
        background: { r: 255, g: 255, b: 255, alpha: 1 },
        mode: "pad",
      });

      const generatedBase64 = await generateImage({
        selfieData: selfieBase64,
        costumeData: costumeBase64,
      });

      if (!generatedBase64) {
        return c.json({ success: false, error: "画像生成に失敗しました" }, { status: 500 });
      }

      const resultBuffer = Buffer.from(generatedBase64, "base64");

      const resultKey = `try-on-results/${jobId}.png`;
      await uploadFile({
        bucket: env.S3_BUCKET,
        key: resultKey,
        body: resultBuffer,
        contentType: "image/png",
      });

      const selfieKey = `try-on-source/${jobId}.png`;
      await uploadFile({
        bucket: env.S3_BUCKET,
        key: selfieKey,
        body: Buffer.from(selfieBase64, "base64"),
        contentType: "image/png",
      });

      let itemId: string | undefined = undefined;
      if (item) {
        const saved = await prisma.item.create({
          data: {
            goodsId: item.goodsId,
            name: item.name ?? "Unknown",
            price: item.price,
            image: item.image,
            image215: item.image215,
            url: item.url,
            brand: item.brand,
            brandJp: item.brandJp,
            isSoldOut: item.isSoldOut,
            colorId: item.colorId,
            colorName: item.colorName,
            goodsDetailId: item.goodsDetailId,
          },
        });
        itemId = saved.id;
      }

      const result = await prisma.tryOnResult.create({
        data: {
          id: jobId,
          resultKey,
          itemId,
          sourceKey: selfieKey,
          userId: session.user.id,
          shareId: jobId,
        },
      });

      return c.json({
        success: true,
        result: { id: result.id, resultKey: result.resultKey, sourceKey: result.sourceKey },
      });
    } catch (error) {
      console.error("Sync try-on error:", error);
      return c.json(
        { success: false, error: "サーバ内部エラー", details: String(error) },
        { status: 500 }
      );
    }
  }
);

export type TryOnApp = typeof tryOnRoute;
