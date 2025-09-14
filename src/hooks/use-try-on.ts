import { ClothesFormValues } from "@/app/(app)/try-on/_components/upload-clothes-card";
import { client } from "@/lib/hono";
import { Product } from "@/lib/scraper";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Payload = {
  clothesImage: File | undefined;
  selfieImage: File | undefined;
  item: Product | undefined;
};

type TryOnResponse = {
  success: boolean;
  error?: string;
  result?: {
    id: string;
    resultKey: string;
    sourceKey: string;
  };
};

export const useTryOn = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URLから状態を復元
  const stepFromUrl = searchParams.get("step");

  const [step, setStep] = useState(stepFromUrl ? parseInt(stepFromUrl, 10) : 1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [item, setItem] = useState<Product | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [payload, setPayload] = useState<Payload>({
    clothesImage: undefined,
    selfieImage: undefined,
    item: undefined,
  });
  const [error, setError] = useState<string | null>(null);

  const ESTIMATED_PROCESSING_TIME = 30000;

  const simulateProgress = (value: number) => {
    setProgress((prev) => Math.max(prev, value));
  };

  const updateUrlState = (params: { step?: number; item?: string | undefined }) => {
    const url = new URL(window.location.href);

    if (params.step !== undefined) {
      url.searchParams.set("step", params.step.toString());
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

  // ロングポーリングは廃止。進捗はUI用の簡易シミュレーションのみ維持。

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
    setPayload({ ...payload, clothesImage: values.imageFile });
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
        if (data.result?.id) {
          router.push(`/result/${data.result.id}`);
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
    error,
    setError,
    clearError,
  };
};
