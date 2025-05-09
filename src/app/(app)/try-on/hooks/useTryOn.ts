import { clothingItems } from "@/components/clothing-items";
import { useEffect, useState } from "react";

export const useTryOn = () => {
  const [step, setStep] = useState(1);
  const [isMobile, setIsMobile] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isClothingUploading, setIsClothingUploading] = useState(false);
  const [isModelImageUploaded, setIsModelImageUploaded] = useState(false);
  const [isClothingImageUploaded, setIsClothingImageUploaded] = useState(false);

  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedItemData, setSelectedItemData] = useState<(typeof clothingItems)[0] | null>(null);

  const [clothingUrl, setClothingUrl] = useState("");
  const [isUrlInputted, setIsUrlInputted] = useState(false);
  const [isUrlValid, setIsUrlValid] = useState(true);
  const [urlError, setUrlError] = useState("");

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  useEffect(() => {
    if (selectedItemData) {
      console.log("選択中のアイテム:", selectedItemData);
    }
  }, [selectedItemData]);

  const processImage = async () => {
    setIsGenerating(true);
    setIsDrawerOpen(false);
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setIsGenerating(false);
    setStep(3);

    console.log("処理完了したアイテム:", selectedItemData);
  };

  const handleItemSelect = (index: number) => {
    setSelectedItem(index);
    const selectedData = clothingItems.find((item) => item.id === index) || null;
    setSelectedItemData(selectedData);
    console.log(`アイテム選択: ID=${index}`, selectedData);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClothingUrl(e.target.value);
    setIsUrlValid(true);
    setUrlError("");
  };

  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const isImageUrl = (url: string): boolean => {
    const extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const lowerCaseUrl = url.toLowerCase();
    return extensions.some((ext) => lowerCaseUrl.endsWith(ext)) || lowerCaseUrl.includes("/image/");
  };

  const handleUrlSubmit = () => {
    if (!clothingUrl.trim()) {
      setIsUrlValid(false);
      setUrlError("URLを入力してください");
      return;
    }

    if (!isValidUrl(clothingUrl)) {
      setIsUrlValid(false);
      setUrlError("有効なURLを入力してください");
      return;
    }

    if (!isImageUrl(clothingUrl)) {
      setIsUrlValid(false);
      setUrlError("画像URLを入力してください");
      return;
    }

    console.log("URLを送信しました:", clothingUrl);
    setIsUrlInputted(true);
    setIsClothingImageUploaded(true);
  };

  const clearSelection = () => {
    setSelectedItem(null);
    setSelectedItemData(null);
  };

  const goToProduct = () => {
    if (selectedItemData) {
      console.log(`商品ページへ遷移: ${selectedItemData.name}`);
      window.location.href = `/products/${selectedItemData.id}`;
    }
  };

  const handleFileSubmit = (file: File, isModelImage: boolean = true) => {
    if (isModelImage) {
      setIsFileUploading(true);
      console.log("モデル画像をアップロードしました:", file);
      setTimeout(() => {
        setIsFileUploading(false);
        setIsModelImageUploaded(true);
      }, 1000);
    } else {
      setIsClothingUploading(true);
      console.log("衣類画像をアップロードしました:", file);
      setTimeout(() => {
        setIsClothingUploading(false);
        setIsClothingImageUploaded(true);
      }, 1000);
    }
  };

  const handleNextStep = () => {
    if (isModelImageUploaded) {
      setStep(2);
    }
  };

  const handleTryAnother = () => {
    setStep(2);
  };

  return {
    step,
    isGenerating,
    isFileUploading,
    isClothingUploading,
    isModelImageUploaded,
    isClothingImageUploaded,
    progress,
    isMobile,
    isDrawerOpen,
    setIsDrawerOpen,
    selectedItem,
    selectedItemData,
    clothingUrl,
    isUrlInputted,
    isUrlValid,
    urlError,
    processImage,
    handleItemSelect,
    clearSelection,
    goToProduct,
    handleFileSubmit,
    handleNextStep,
    handleTryAnother,
    handleUrlChange,
    handleUrlSubmit,
  };
};
