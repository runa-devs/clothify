"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AboutCard } from "../_components/about-card";
import { ItemPreviewCard } from "../_components/item-preview-card";
import { ItemSelectionCard } from "../_components/item-selection-card";
import { ItemsPanel } from "../_components/items-panel";
import { ProcessingCard } from "../_components/processing-card";
import { ProgressBar } from "../_components/progress-bar";
import { ResultCard } from "../_components/result-card";
import { UploadCard } from "../_components/upload-card";

// サンプルアイテムデータ（ItemGridコンポーネントのデータと同じ）
const sampleItems = [
  // トップス
  {
    id: 1,
    name: "カジュアルTシャツ",
    sourceImage: "/samples/source/tops/1.jpg",
    unprocessedImage: "/samples/unprocessed/tops/1.jpg",
    processedImage: "/samples/processed/tops/1.png",
    type: "トップス",
  },
  {
    id: 2,
    name: "スタイリッシュシャツ",
    sourceImage: "/samples/source/tops/2.jpg",
    unprocessedImage: "/samples/unprocessed/tops/2.jpg",
    processedImage: "/samples/processed/tops/2.png",
    type: "トップス",
  },
  // パンツ
  {
    id: 6,
    name: "デニムパンツ",
    sourceImage: "/samples/source/pants/1.jpg",
    unprocessedImage: "/samples/unprocessed/pants/1.webp",
    processedImage: "/samples/processed/pants/1.png",
    type: "パンツ",
  },
  // 帽子
  {
    id: 11,
    name: "ベースボールキャップ",
    sourceImage: "/samples/source/hat/1.jpg",
    unprocessedImage: "/samples/unprocessed/hat/1.jpg",
    processedImage: "/samples/processed/hat/1.png",
    type: "帽子",
  },
  // メガネ
  {
    id: 16,
    name: "ラウンドフレーム",
    sourceImage: "/samples/source/glasses/1.jpg",
    unprocessedImage: "/samples/unprocessed/glasses/1.jpg",
    processedImage: "/samples/processed/glasses/1.png",
    type: "メガネ",
  },
];

export default function TryOnPage() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedItemData, setSelectedItemData] = useState<(typeof sampleItems)[0] | null>(null);

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

  // Mock image processing
  const processImage = async () => {
    setIsProcessing(true);
    setIsDrawerOpen(false);
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setIsProcessing(false);
    setStep(3);
  };

  const handleItemSelect = (index: number) => {
    setSelectedItem(index);
    // 選択されたアイテムのデータを取得
    const selectedData = sampleItems.find((item) => item.id === index) || null;
    setSelectedItemData(selectedData);
  };

  const clearSelection = () => {
    setSelectedItem(null);
    setSelectedItemData(null);
  };

  return (
    <main className="flex flex-1 flex-col">
      <div className="container mx-auto max-w-5xl space-y-6 px-4 pt-24">
        <ProgressBar step={step} className="mb-10" />

        <div
          className={cn(
            "md:grid md:gap-8",
            step === 1 && !isMobile ? "md:grid-cols-[1fr_1fr]" : "md:grid-cols-[1fr_400px]"
          )}
        >
          <div className="mx-auto max-w-md md:mx-0">
            {step === 1 && <UploadCard onUpload={() => setStep(2)} />}

            {step === 2 && isMobile && (
              <ItemSelectionCard
                selectedItem={selectedItem}
                onItemSelect={handleItemSelect}
                onProcess={processImage}
                isDrawerOpen={isDrawerOpen}
                setIsDrawerOpen={setIsDrawerOpen}
              />
            )}

            {step === 2 && !isMobile && (
              <ItemPreviewCard
                selectedItemIndex={selectedItem}
                onClearSelection={clearSelection}
                onProcess={processImage}
              />
            )}

            {isProcessing && <ProcessingCard progress={progress} />}

            {step === 3 && !isProcessing && (
              <ResultCard
                onTryAnother={() => setStep(2)}
                onGoToProduct={() => console.log("Navigate to product page")}
                beforeImage={selectedItemData?.unprocessedImage}
                afterImage={selectedItemData?.processedImage}
                itemName={selectedItemData?.name}
                itemType={selectedItemData?.type}
              />
            )}
          </div>

          {step === 1 && !isMobile && <AboutCard isMobile={isMobile} />}

          {step === 2 && !isMobile && (
            <ItemsPanel
              selectedItem={selectedItem}
              onItemSelect={handleItemSelect}
              onProcess={processImage}
              isMobile={isMobile}
            />
          )}
        </div>
      </div>
    </main>
  );
}
