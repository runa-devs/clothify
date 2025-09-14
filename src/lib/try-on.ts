import { google } from "@ai-sdk/google";
import { generateText } from "ai";

type TryOnRequestParams = {
  selfieData: string; // base64 encoded (no data URI prefix)
  costumeData: string; // base64 encoded (no data URI prefix)
};

const PROMPT = `
You are an AI assistant that helps with virtual try-on tasks. You will be given two images:

1. The first image shows a person (selfie)
2. The second image shows clothing or accessories that should be worn by the person

Your task is to generate a realistic image showing the person from the first image wearing the clothing/accessories from the second image. Please:

- Maintain the person's facial features, body proportions, and pose as much as possible
- Accurately apply the clothing/accessories from the second image onto the person
- Ensure proper fit, lighting, and shadows to make the result look natural and realistic
- Keep the background and overall composition similar to the original selfie
- Pay attention to details like fabric texture, color accuracy, and proper layering of clothing items

Generate a high-quality, photorealistic result that looks like the person is actually wearing the specified clothing/accessories.
`;

export const generateImage = async (params: TryOnRequestParams) => {
  const { selfieData, costumeData } = params;

  const result = await generateText({
    model: google("gemini-2.5-flash-image-preview"),
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            image: `data:image/png;base64,${selfieData}`,
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "image",
            image: `data:image/png;base64,${costumeData}`,
          },
        ],
      },
      {
        role: "user",
        content: PROMPT,
      },
    ],
    maxRetries: 5,
  });

  for (const file of result.files) {
    if (file.mediaType.startsWith("image/")) {
      return file.base64;
    }
  }

  return null;
};
