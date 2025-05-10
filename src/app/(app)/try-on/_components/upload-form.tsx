import { z } from "zod";

export const uploadFormSchema = z.object({
  modelImage: z.instanceof(File),
  clothingImage: z.instanceof(File),
});
