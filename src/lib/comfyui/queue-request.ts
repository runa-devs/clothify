import { env } from "@/env/server";
import { Client, WorkflowOutputResolver } from "@stable-canvas/comfyui-client";
import WebSocket from "ws";
import basePrompt from "./s3_clothify.json";

const client = new Client({
  api_host: env.COMFYUI_API_HOST ?? "http://localhost:8188",
  WebSocket,
});

client.connect();

/**
 * ComfyUIのキューリクエストのためのインターフェース
 *
 * @interface QueueRequest
 * @property clothKey - 衣服画像のS3キー
 * @property selfieKey - 自撮り画像のS3キー
 * @property resultKey - 生成結果を保存するためのS3キー
 */
interface QueueRequest {
  clothKey: string;
  selfieKey: string;
  resultKey: string;
}

interface MakePromptParams {
  clothKey: string;
  selfieKey: string;
  resultKey: string;
}

const getPrompt = ({ clothKey, selfieKey, resultKey }: MakePromptParams) => {
  const prompt = structuredClone(basePrompt);
  // @ts-expect-error ts(2322)
  prompt[272].inputs.image = clothKey;
  // @ts-expect-error ts(2322)
  prompt[270].inputs.image = selfieKey;
  // @ts-expect-error ts(2322)
  prompt[271].inputs.image = resultKey;

  return prompt;
};

const outPutResolver: WorkflowOutputResolver<string> = (resp, node_output) => {
  // TODO: replace with S3 upload and update status
  console.log("get Output on node", node_output.node_id);
  console.log("output", node_output.result);
  console.log("acc", resp.data ?? node_output.result);

  return {
    ...resp,
    data: (resp.data ?? node_output.result) as string,
  };
};

/**
 * ComfyUIのキューにリクエストを追加し、画像生成を実行します
 *
 * @param params - リクエストパラメータ
 * @returns 生成結果のS3キー
 * @throws キューが満杯の場合にエラーをスロー
 *
 * @example
 * ```ts
 * const result = await queueRequest({
 *   clothKey: "costumes/red-dress.jpg",
 *   selfieKey: "selfies/user123.jpg",
 *   resultKey: "results/output.jpg"
 * });
 * console.log(result); // 生成された画像のS3キー
 * ```
 */
export const queueRequest = async ({ clothKey, selfieKey, resultKey }: QueueRequest) => {
  const queue = await client.getQueue();
  if (queue.Pending.length >= 10) {
    throw new Error("Queue is full");
  }
  const response = await client.enqueue<string>(getPrompt({ clothKey, selfieKey, resultKey }), {
    resolver: outPutResolver,
  });

  return response.data;
};
