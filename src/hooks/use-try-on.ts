import { ClothesFormValues } from "@/app/(app)/try-on/_components/upload-clothes-card";
import { client } from "@/lib/hono";
import { Product } from "@/lib/scraper";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Payload = {
  clothesImage: File | undefined;
  selfieImage: File | undefined;
  category: string | undefined;
  item: Product | undefined;
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

  const [step, setStep] = useState(stepFromUrl ? parseInt(stepFromUrl, 10) : 1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [item, setItem] = useState<Product | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(jobIdFromUrl);
  const [jobStatus, setJobStatus] = useState<JobStatus>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [payload, setPayload] = useState<Payload>({
    clothesImage: undefined,
    selfieImage: undefined,
    category: undefined,
    item: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  // 処理の予想時間（ミリ秒）- 約4分40秒
  const ESTIMATED_PROCESSING_TIME = 280000;

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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
                clearError();

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
                const errorMessage = statusData.error || "ジョブ処理に失敗しました。";
                setError(errorMessage);
                console.error("ジョブ処理に失敗しました:", errorMessage);

                setJobId(null);
                updateUrlState({ jobId: null });
              }
            } else {
              const errorMessage =
                statusData.error || `ステータス確認エラー: ${statusResponse.status}`;
              // For server-side errors during polling, we might want to stop polling too.
              clearInterval(interval);
              setPollingInterval(null);
              setIsGenerating(false);
              setStartTime(null);
              setError(errorMessage);
              console.error("ステータス確認エラー:", statusData);
            }
          } catch (e) {
            const errorMessage =
              e instanceof Error ? e.message : "ポーリング中に予期せぬエラーが発生しました。";
            setError(errorMessage);
            console.error("ポーリングエラー:", e);
            clearInterval(interval); // Stop polling on error
            setPollingInterval(null); // Clear interval ID
            setIsGenerating(false); // Set generating to false
            setStartTime(null); // Reset start time
          }
        }, POLLING_INTERVAL);

        setPollingInterval(interval);
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "ポーリング開始時にエラーが発生しました。";
        setError(errorMessage);
        console.error("ポーリング開始エラー:", e);
        setIsGenerating(false);
        setStartTime(null);
      }
    },
    [router, clearError]
  );

  useEffect(() => {
    if (jobIdFromUrl && !pollingInterval) {
      clearError();
      setIsGenerating(true);
      setStartTime(Date.now());
      pollJobStatus(jobIdFromUrl);
    }
  }, [jobIdFromUrl, pollJobStatus, pollingInterval, clearError]);

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
    clearError();
    setPayload({ ...payload, clothesImage: values.imageFile, category: values.category });
  };

  const handleSelfieChange = (file: File) => {
    clearError();
    setPayload({ ...payload, selfieImage: file });
  };

  const completeStep1 = () => {
    clearError();
    if (payload.clothesImage && payload.selfieImage) {
      processImage();
    } else {
      const newStep = 2;
      setStep(newStep);
      updateUrlState({ step: newStep });
    }
  };

  const handleItemSelect = ({ item, file }: { item: Product; file: File }) => {
    clearError();
    setPayload({
      ...payload,
      clothesImage: file,
      item: item,
      category: "upper_clothes",
    });
    setItem(item);
    updateUrlState({ item: item.name });
  };

  const processImage = async () => {
    clearError();
    setIsGenerating(true);
    setProgress(0);
    setStartTime(Date.now());
    console.log(payload);

    if (!payload.selfieImage || !payload.clothesImage) {
      const msg = "画像が選択されていません";
      setError(msg);
      setIsGenerating(false);
      setStartTime(null);
      return;
    }

    try {
      const result = await client.api["try-on"].$post({
        form: {
          selfie: payload.selfieImage,
          costume: payload.clothesImage,
          category: payload.category ?? "upper_clothes",
          ...(payload.item && {
            "item.goodsId": payload.item.goodsId.toString(),
            "item.name": payload.item.name,
            "item.price": payload.item.price,
            "item.image": payload.item.image,
            "item.image215": payload.item.image215,
            "item.url": payload.item.url,
            "item.brand": payload.item.brand,
            "item.brandJp": payload.item.brandJp,
            "item.isSoldOut": payload.item.isSoldOut.toString(),
            "item.colorId": payload.item.colorId.toString(),
            "item.colorName": payload.item.colorName,
            "item.goodsDetailId": payload.item.goodsDetailId.toString(),
          }),
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
      const errorMessage = errorData.error || "画像の処理に失敗しました";
      setError(errorMessage);
    } catch (e) {
      setIsGenerating(false);
      setStartTime(null);
      const errorMessage =
        e instanceof Error ? e.message : "画像の処理中に予期せぬエラーが発生しました。";
      setError(errorMessage);
      console.error("処理エラー:", e);
    }
  };

  useEffect(() => {
    updateUrlState({ step });
  }, [step]);

  const updateStep = (newStep: number) => {
    clearError();
    setStep(newStep);
    updateUrlState({ step: newStep });
  };

  return {
    handleClothesChange,
    handleSelfieChange,
    payload,
    step,
    setStep: updateStep,
    completeStep1,
    isGenerating,
    progress,
    item,
    handleItemSelect,
    processImage,
    simulateProgress,
    jobId,
    jobStatus,
    error,
    setError,
    clearError,
  };
};
