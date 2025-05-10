import { env } from "@/env/server";
import { File } from "node:buffer";

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
  const buffer = await file.arrayBuffer();
  const base64Data = Buffer.from(buffer).toString("base64");
  return base64Data;
}

/**
 * Converts a Blob to a temporary URL (Object URL)
 * @param blob - The Blob to convert
 * @returns A temporary URL
 */
export function createObjectURLFromBlob(blob: Blob): string {
  return URL.createObjectURL(blob);
}
