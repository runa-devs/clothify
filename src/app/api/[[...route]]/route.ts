import { env } from "@/env/server";
import { getBase64FromFile, sendTryOnRequest, type ComfyUIRequest } from "@/lib/comfyui";
import { uploadFile } from "@/lib/s3";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { nanoid } from "nanoid";
import { z } from "zod";

const app = new Hono().basePath("/api");

const tryOnSchema = z.object({
  selfie: z.instanceof(File, { message: "自撮り写真が必要です" }),
  costume: z.instanceof(File, { message: "衣服の画像が必要です" }),
  category: z.string().min(1, { message: "カテゴリーを指定してください" }),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route = app.post(
  "/try-on",
  zValidator("form", tryOnSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          errors: result.error.format(),
        },
        { status: 400 }
      );
    }
  }),
  async (c) => {
    try {
      const { selfie, costume, category } = c.req.valid("form");

      const selfieData = await getBase64FromFile(selfie);
      const costumeData = await getBase64FromFile(costume);

      const comfyRequest: ComfyUIRequest = {
        selfieData,
        costumeData,
        category,
      };

      const resultBlob = await sendTryOnRequest(comfyRequest);

      const buffer = Buffer.from(await resultBlob.arrayBuffer());

      const id = nanoid();
      const resultKey = `try-on-results/${id}.png`;
      const sourceKey = `try-on-source/${id}.png`; // source image means the image of the item

      try {
        await uploadFile({
          bucket: env.S3_BUCKET,
          key: resultKey,
          body: buffer,
          contentType: "image/png",
        });
      } catch (error) {
        console.error("Try-on result upload error:", error);
      }

      try {
        await uploadFile({
          bucket: env.S3_BUCKET,
          key: sourceKey,
          body: buffer,
          contentType: "image/png",
        });
      } catch (error) {
        console.error("Try-on source upload error:", error);
      }

      return c.json({
        success: true,
        id,
        resultKey,
        sourceKey,
      });
    } catch (error) {
      console.error("Try-on processing error:", error);
      return c.json(
        { success: false, error: "試着処理に失敗しました", details: String(error) },
        { status: 500 }
      );
    }
  }
);

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
