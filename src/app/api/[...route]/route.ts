import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { z } from "zod";
import { catalogRoute } from "./catalog";
import { tryOnRoute } from "./try-on";

const app = new Hono().basePath("/api");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route = app
  .route("/search", catalogRoute)
  .route("/try-on", tryOnRoute)
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

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
