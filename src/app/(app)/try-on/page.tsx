"use client";

import { clothingItems } from "@/components/clothing-items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
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
const sampleItems = clothingItems;

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

  // 選択中のアイテムをコンソールに表示
  useEffect(() => {
    if (selectedItemData) {
      console.log("選択中のアイテム:", selectedItemData);
    }
  }, [selectedItemData]);

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

    // 処理完了時に選択中のアイテムをコンソールに表示
    console.log("処理完了したアイテム:", selectedItemData);
  };

  const handleItemSelect = (index: number) => {
    setSelectedItem(index);
    // 選択されたアイテムのデータを取得
    const selectedData = sampleItems.find((item) => item.id === index) || null;
    setSelectedItemData(selectedData);

    // 選択されたアイテムをコンソールに表示
    console.log(`アイテム選択: ID=${index}`, selectedData);
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
                onGoToProduct={() => {
                  // 商品ページへ遷移
                  if (selectedItemData) {
                    console.log(`商品ページへ遷移: ${selectedItemData.name}`);
                    // 実際の遷移処理（例: 商品IDに基づくページへの遷移）
                    window.location.href = `/products/${selectedItemData.id}`;
                  }
                }}
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

          {step === 3 && !isMobile && !isProcessing && (
            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">商品詳細</CardTitle>
                </CardHeader>
                <CardContent className="pb-3 text-sm">
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-1 font-medium">素材</h4>
                      <p className="text-muted-foreground">綿100%、高品質な素材を使用</p>
                    </div>
                    <div>
                      <h4 className="mb-1 font-medium">サイズ展開</h4>
                      <div className="mt-1 flex gap-1">
                        {["S", "M", "L", "XL"].map((size) => (
                          <div
                            key={size}
                            className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-border text-xs hover:bg-accent"
                          >
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-1 font-medium">商品説明</h4>
                      <p className="text-muted-foreground">
                        柔らかい肌触りで、カジュアルからスマートカジュアルまで幅広いシーンで活躍する一着。
                        耐久性に優れた縫製を施し、洗濯による色落ちや縮みを最小限に抑えました。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">よく一緒に購入されている商品</CardTitle>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="grid grid-cols-2 gap-3">
                    {sampleItems.slice(0, 4).map((item) => (
                      <div key={item.id} className="cursor-pointer hover:opacity-80">
                        <div className="relative mb-1 aspect-square w-full overflow-hidden rounded-md">
                          <Image
                            src={item.sourceImage}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="truncate text-xs font-medium">{item.name}</p>
                        <p className="text-xs text-primary">¥4,290</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
