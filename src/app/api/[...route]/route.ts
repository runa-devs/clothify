import { env } from "@/env/server";
import { auth } from "@/lib/auth";
import { sendTryOnRequest, type ComfyUIRequest } from "@/lib/comfyui";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/s3";
import { zValidator } from "@hono/zod-validator";
import { Buffer } from "buffer";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { nanoid } from "nanoid";
import { File } from "node:buffer";
import { z } from "zod";

const app = new Hono().basePath("/api");

const tryOnSchema = z.object({
  selfie: z.instanceof(File, { message: "自撮り写真が必要です" }),
  costume: z.instanceof(File, { message: "衣服の画像が必要です" }),
  category: z.string().min(1, { message: "カテゴリーを指定してください" }),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route = app
  .post(
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
      const session = await auth();
      if (!session) {
        return c.json({ success: false, error: "Not authenticated" }, { status: 401 });
      }

      try {
        const { selfie, costume, category } = c.req.valid("form");

        const id = nanoid();
        const selfieBuffer = Buffer.from(await selfie.arrayBuffer()).toString("base64");
        const costumeBuffer = Buffer.from(await costume.arrayBuffer()).toString("base64");

        await prisma.tryOnJob.create({
          data: {
            id,
            category,
            status: "PENDING",
            userId: session.user.id,
          },
        });

        void processTryOnJob(id, selfieBuffer, costumeBuffer);

        return c.json({
          success: true,
          jobId: id,
          status: "PENDING",
          message:
            "試着処理を開始しました。処理状況を確認するには /api/try-on/status/:id にアクセスしてください。",
        });
      } catch (error) {
        console.error("Try-on queue error:", error);
        return c.json(
          { success: false, error: "試着処理のキューイングに失敗しました", details: String(error) },
          { status: 500 }
        );
      }
    }
  )
  .get("/try-on/status/:id", zValidator("param", z.object({ id: z.string() })), async (c) => {
    const session = await auth();
    if (!session) {
      return c.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const { id } = c.req.param();

    const job = await prisma.tryOnJob.findUnique({
      where: { id, userId: session.user.id },
    });

    if (!job) {
      return c.json({ success: false, error: "Job not found" }, { status: 404 });
    }

    if (job.status === "COMPLETED") {
      const result = await prisma.tryOnResult.findUnique({
        where: { id: job.id },
      });

      if (result) {
        return c.json({
          success: true,
          status: job.status,
          result: {
            id: result.id,
            resultKey: result.resultKey,
            sourceKey: result.sourceKey,
          },
        });
      }
    }

    return c.json({
      success: true,
      status: job.status,
      message: job.status === "FAILED" ? job.error || "処理に失敗しました" : undefined,
    });
  })
  .post(
    "/result/:id/public",
    zValidator("json", z.object({ isPublic: z.boolean() })),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const session = await auth();
      const { isPublic } = c.req.valid("json");
      if (!session) {
        return c.json({ success: false, error: "Not authenticated" }, { status: 401 });
      }

      const { id } = c.req.param();

      const result = await prisma.tryOnResult.update({
        where: { id, userId: session.user.id },
        data: {
          isPublic: isPublic,
        },
      });

      if (!result) {
        return c.json({ success: false, error: "Result not found" }, { status: 404 });
      }

      return c.json({ success: true, isPublic: result.isPublic });
    }
  );
async function processTryOnJob(
  jobId: string,
  selfieData: string,
  costumeData: string
): Promise<void> {
  try {
    const job = await prisma.tryOnJob.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      console.error(`Job ${jobId} not found`);
      return;
    }

    if (!selfieData || !costumeData) {
      throw new Error("Image data not found in job details");
    }

    await prisma.tryOnJob.update({
      where: { id: jobId },
      data: { status: "PROCESSING" },
    });

    const comfyRequest: ComfyUIRequest = {
      selfieData,
      costumeData,
      category: job.category,
    };

    const resultBlob = await sendTryOnRequest(comfyRequest);
    const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());

    const resultKey = `try-on-results/${jobId}.png`;
    await uploadFile({
      bucket: env.S3_BUCKET,
      key: resultKey,
      body: resultBuffer,
      contentType: "image/png",
    });

    const originalSelfieBuffer = Buffer.from(selfieData, "base64");
    const originalSelfieKey = `try-on-source/${jobId}.png`;
    await uploadFile({
      bucket: env.S3_BUCKET,
      key: originalSelfieKey,
      body: originalSelfieBuffer,
      contentType: "image/png",
    });

    await prisma.tryOnResult.create({
      data: {
        id: jobId,
        resultKey,
        sourceKey: originalSelfieKey,
        userId: job.userId,
        shareId: jobId,
      },
    });

    await prisma.tryOnJob.update({
      where: { id: jobId },
      data: { status: "COMPLETED" },
    });
  } catch (error) {
    console.error(`Processing error for job ${jobId}:`, error);

    await prisma.tryOnJob.update({
      where: { id: jobId },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : String(error),
      },
    });
  }
}

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
