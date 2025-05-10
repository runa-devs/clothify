import { env } from "@/env/server";

export interface ComfyUIRequest {
  costumeData: string;
  selfieData: string;
  category: string;
}

export interface ComfyUIResponse {
  imageUrl: string;
}

/**
 * Sends a try-on request to the ComfyUI API
 * @param request - The request object containing costumeData, selfieData, and category
 * @returns A Promise that resolves to a Blob containing the generated image
 */
export async function sendTryOnRequest(request: ComfyUIRequest): Promise<Blob> {
  const apiHost = env.COMFYUI_API_HOST;
  if (!apiHost) {
    throw new Error("COMFYUI_API_HOST environment variable is not set.");
  }

  try {
    const response = await fetch(apiHost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `ComfyUI API error: ${response.status} ${response.statusText} - ${errorData}`
      );
    }

    return await response.blob();
  } catch (error) {
    console.error("ComfyUI API request error:", error);
    throw error;
  }
}

export async function getBase64FromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(",")[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Converts a Blob to a temporary URL (Object URL)
 * @param blob - The Blob to convert
 * @returns A temporary URL
 */
export function createObjectURLFromBlob(blob: Blob): string {
  return URL.createObjectURL(blob);
}
