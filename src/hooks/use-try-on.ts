import { ClothesFormValues } from "@/app/(app)/try-on/_components/upload-clothes-card";
import { clothingItems } from "@/components/clothing-items";
import { client } from "@/lib/hono";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Payload = {
  clothesImage: File | undefined;
  selfieImage: File | undefined;
  category: string | undefined;
};

type JobStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | null;

type TryOnResponse = {
  success: boolean;
  jobId?: string;
  id?: string;
  status?: JobStatus;
  error?: string;
  result?: {
    id: string;
    resultKey: string;
    sourceKey: string;
  };
  progress?: number;
};

export const useTryOn = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URLから状態を復元
  const stepFromUrl = searchParams.get("step");
  const jobIdFromUrl = searchParams.get("jobId");
  const itemFromUrl = searchParams.get("item");

  const [step, setStep] = useState(stepFromUrl ? parseInt(stepFromUrl, 10) : 1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [item, setItem] = useState<string | undefined>(itemFromUrl || undefined);
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(jobIdFromUrl);
  const [jobStatus, setJobStatus] = useState<JobStatus>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [payload, setPayload] = useState<Payload>({
    clothesImage: undefined,
    selfieImage: undefined,
    category: undefined,
  });

  // 処理の予想時間（ミリ秒）- 約30秒
  const ESTIMATED_PROCESSING_TIME = 130000;

  const simulateProgress = (value: number) => {
    setProgress((prev) => Math.max(prev, value));
  };

  const updateUrlState = (params: {
    step?: number;
    jobId?: string | null;
    item?: string | undefined;
  }) => {
    const url = new URL(window.location.href);

    if (params.step !== undefined) {
      url.searchParams.set("step", params.step.toString());
    }

    if (params.jobId) {
      url.searchParams.set("jobId", params.jobId);
    } else if (params.jobId === null && url.searchParams.has("jobId")) {
      url.searchParams.delete("jobId");
    }

    if (params.item) {
      url.searchParams.set("item", params.item);
    } else if (params.item === undefined && url.searchParams.has("item")) {
      url.searchParams.delete("item");
    }

    if (url.toString() !== window.location.href) {
      window.history.replaceState({}, "", url.toString());
    }
  };

  const pollJobStatus = useCallback(
    async (id: string) => {
      try {
        const POLLING_INTERVAL = 3000;

        const interval = setInterval(async () => {
          try {
            const statusResponse = await fetch(`/api/try-on/status/${id}`);
            const statusData = (await statusResponse.json()) as TryOnResponse;

            if (statusResponse.ok) {
              if (statusData.progress !== undefined) {
                // 現在の進捗より大きい場合のみ更新
                setProgress((prev) => Math.max(prev, statusData.progress as number));
              }

              if (statusData.status) {
                setJobStatus(statusData.status);
              }

              if (statusData.status === "COMPLETED") {
                clearInterval(interval);
                setPollingInterval(null);
                setIsGenerating(false);
                setStartTime(null);

                setJobId(null);
                updateUrlState({ jobId: null });

                if (statusData.result && statusData.result.id) {
                  router.push(`/result/${statusData.result.id}`);
                }
              } else if (statusData.status === "FAILED") {
                clearInterval(interval);
                setPollingInterval(null);
                setIsGenerating(false);
                setStartTime(null);

                setJobId(null);
                updateUrlState({ jobId: null });

                console.error("ジョブ処理に失敗しました:", statusData.error);
              }
            } else {
              console.error("ステータス確認エラー:", statusData);
            }
          } catch (error) {
            console.error("ポーリングエラー:", error);
          }
        }, POLLING_INTERVAL);

        setPollingInterval(interval);
      } catch (error) {
        console.error("ポーリング開始エラー:", error);
        setIsGenerating(false);
        setStartTime(null);
      }
    },
    [router]
  );

  useEffect(() => {
    if (jobIdFromUrl && !pollingInterval) {
      setIsGenerating(true);
      setStartTime(Date.now());
      pollJobStatus(jobIdFromUrl);
    }
  }, [jobIdFromUrl, pollJobStatus, pollingInterval]);

  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  useEffect(() => {
    if (isGenerating && startTime) {
      const simulationInterval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        const calculatedProgress = Math.min(95, (elapsedTime / ESTIMATED_PROCESSING_TIME) * 100);

        simulateProgress(calculatedProgress);

        if (calculatedProgress >= 95) {
          clearInterval(simulationInterval);
        }
      }, 500);

      return () => clearInterval(simulationInterval);
    }
  }, [isGenerating, startTime]);

  const handleClothesChange = (values: ClothesFormValues) => {
    setPayload({ ...payload, clothesImage: values.imageFile, category: values.category });
  };

  const handleSelfieChange = (file: File) => {
    setPayload({ ...payload, selfieImage: file });
  };

  const completeStep1 = () => {
    if (payload.clothesImage && payload.selfieImage) {
      processImage();
    } else {
      const newStep = 2;
      setStep(newStep);
      updateUrlState({ step: newStep });
    }
  };

  const handleItemSelect = (item: (typeof clothingItems)[0]) => {
    const file = new File([item.sourceImage], item.name, { type: "image/jpeg" });
    setPayload({
      ...payload,
      clothesImage: file,
      category: item.category,
    });
    setItem(item.name);
    updateUrlState({ item: item.name });
  };

  const processImage = async () => {
    setIsGenerating(true);
    setProgress(0);
    setStartTime(Date.now());
    console.log(payload);

    if (!payload.selfieImage || !payload.clothesImage) {
      throw new Error("画像が選択されていません");
    }

    try {
      const result = await client.api["try-on"].$post({
        form: {
          selfie: payload.selfieImage,
          costume: payload.clothesImage,
          category: payload.category ?? "upper_clothes",
        },
      });

      if (result.status === 200) {
        const data = (await result.json()) as TryOnResponse;

        if (data.jobId) {
          setJobId(data.jobId);
          updateUrlState({ jobId: data.jobId, step: 3 });
          setStep(3);
        }

        if (data.status) {
          setJobStatus(data.status);
        }

        if (data.jobId) {
          pollJobStatus(data.jobId);
        } else if (data.id) {
          router.push(`/result/${data.id}`);
          setIsGenerating(false);
          setStartTime(null);
        }

        return;
      }

      setIsGenerating(false);
      setStartTime(null);
      const errorData = (await result.json()) as TryOnResponse;
      throw new Error(errorData.error || "画像の処理に失敗しました");
    } catch (error) {
      setIsGenerating(false);
      setStartTime(null);
      console.error("処理エラー:", error);
      throw error;
    }
  };

  useEffect(() => {
    updateUrlState({ step });
  }, [step]);

  return {
    handleClothesChange,
    handleSelfieChange,
    payload,
    step,
    setStep: (newStep: number) => {
      setStep(newStep);
      updateUrlState({ step: newStep });
    },
    completeStep1,
    isGenerating,
    progress,
    item,
    handleItemSelect,
    processImage,
    simulateProgress, // 進捗シミュレーション関数を公開
    jobId,
    jobStatus,
  };
};
