import { ClothesFormValues } from "@/app/(app)/try-on/_components/upload-clothes-card";
import { clothingItems } from "@/components/clothing-items";
import { client } from "@/lib/hono";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Payload = {
  clothesImage: File | undefined;
  selfieImage: File | undefined;
  category: string | undefined;
};

export const useTryOn = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [item, setItem] = useState<string | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const [payload, setPayload] = useState<Payload>({
    clothesImage: undefined,
    selfieImage: undefined,
    category: undefined,
  });
  const router = useRouter();

  const handleClothesChange = (values: ClothesFormValues) => {
    setPayload({ ...payload, clothesImage: values.imageFile, category: values.category });
  };

  const handleSelfieChange = (file: File) => {
    setPayload({ ...payload, selfieImage: file });
  };

  const completeStep1 = () => {
    if (payload.clothesImage && payload.selfieImage) {
      processImage();
    }
    setStep(2);
  };

  const handleItemSelect = (item: (typeof clothingItems)[0]) => {
    const file = new File([item.sourceImage], item.name, { type: "image/jpeg" });
    setPayload({
      ...payload,
      clothesImage: file,
      category: item.category,
      // itemId: item.id,
    });
    setItem(item.name);
  };

  const processImage = async () => {
    setIsGenerating(true);
    setProgress(0);
    console.log(payload);

    if (!payload.selfieImage || !payload.clothesImage) {
      throw new Error("画像が選択されていません");
    }

    const result = await client.api["try-on"].$post({
      form: {
        selfie: payload.selfieImage,
        costume: payload.clothesImage,
        category: payload.category ?? "uppper_clothes",
      },
    });

    if (result.status === 200) {
      const data = await result.json();
      router.push(`/result/${data.id}`);
      return;
    }

    throw new Error("画像の処理に失敗しました");
  };

  return {
    handleClothesChange,
    handleSelfieChange,
    payload,
    step,
    setStep,
    completeStep1,
    isGenerating,
    progress,
    item,
    handleItemSelect,
    processImage,
  };
};
