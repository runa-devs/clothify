import { clothingItems } from "@/components/clothing-items";
import { useEffect, useState } from "react";

export const useTryOn = () => {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedItemData, setSelectedItemData] = useState<(typeof clothingItems)[0] | null>(null);

  // Check if window width is mobile size
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

  const handleFileSelect = () => {
    setIsFileUploading(true);
    setTimeout(() => {
      setIsFileUploading(false);
      setStep(2);
    }, 1000);
  };

  const handleTryAnother = () => {
    setStep(2);
  };

  return {
    step,
    isGenerating,
    isFileUploading,
    progress,
    isMobile,
    isDrawerOpen,
    setIsDrawerOpen,
    selectedItem,
    selectedItemData,
    processImage,
    handleItemSelect,
    clearSelection,
    goToProduct,
    handleFileSelect,
    handleTryAnother,
  };
};
