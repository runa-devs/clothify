import sharp from "sharp";

export type PadMode = "pad" | "cover";

export type AspectFitOptions = {
  background?: { r: number; g: number; b: number; alpha?: number };
  mode?: PadMode;
};

/**
 * Pads or covers the clothes image to match the selfie aspect and size.
 * Returns PNG base64 without data URI prefix.
 */
export async function padClothesToSelfieAspect(
  selfieBase64: string,
  clothesBase64: string,
  options: AspectFitOptions = {}
): Promise<string> {
  const background = options.background ?? { r: 255, g: 255, b: 255, alpha: 1 };
  const mode: PadMode = options.mode ?? "pad";

  const selfieBuffer = Buffer.from(selfieBase64, "base64");
  const clothesBuffer = Buffer.from(clothesBase64, "base64");

  const selfieMeta = await sharp(selfieBuffer).metadata();
  const clothesMeta = await sharp(clothesBuffer).metadata();

  if (!selfieMeta.width || !selfieMeta.height || !clothesMeta.width || !clothesMeta.height) {
    throw new Error("Invalid image metadata");
  }

  const targetWidth = selfieMeta.width;
  const targetHeight = selfieMeta.height;

  const resized = await sharp(clothesBuffer)
    .resize({
      width: targetWidth,
      height: targetHeight,
      fit: mode === "pad" ? "inside" : "cover",
      withoutEnlargement: false,
    })
    .toBuffer();

  if (mode === "cover") {
    // Already exact canvas size with cover strategy when using extract after resize. But keep simple:
    const covered = await sharp(resized)
      .resize({ width: targetWidth, height: targetHeight, fit: "cover" })
      .png()
      .toBuffer();
    return covered.toString("base64");
  }

  // pad (contain) path: center on canvas
  const canvas = sharp({
    create: {
      width: targetWidth,
      height: targetHeight,
      channels: 4,
      background,
    },
  });

  const resizedMeta = await sharp(resized).metadata();
  const left = Math.floor(((targetWidth ?? 0) - (resizedMeta.width ?? 0)) / 2);
  const top = Math.floor(((targetHeight ?? 0) - (resizedMeta.height ?? 0)) / 2);

  const padded = await canvas
    .composite([{ input: resized, left: Math.max(0, left), top: Math.max(0, top) }])
    .png()
    .toBuffer();

  return padded.toString("base64");
}
