"use client";

import { cn } from "@/lib/utils";
import { AboutCard } from "../_components/about-card";
import { ItemPreviewCard } from "../_components/item-preview-card";
import { ItemSelectionCard } from "../_components/item-selection-card";
import { ItemsPanel } from "../_components/items-panel";
import { ProcessingCard } from "../_components/processing-card";
import { ProgressBar } from "../_components/progress-bar";
import { ResultCard } from "../_components/result-card";
import { UploadCard } from "../_components/upload-card";
import { ResultPanel } from "./_components/result-panel";
import { useTryOn } from "./hooks/useTryOn";

export default function TryOnPage() {
  const {
    step,
    isGenerating,
    progress,
    isMobile,
    isFileUploading,
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
  } = useTryOn();

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
            {step === 1 && (
              <UploadCard onFileSelect={handleFileSelect} disabled={isFileUploading} />
            )}

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

            {isGenerating && <ProcessingCard progress={progress} />}

            {step === 3 && !isGenerating && (
              <ResultCard
                onTryAnother={handleTryAnother}
                onGoToProduct={goToProduct}
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

          {step === 3 && !isMobile && !isGenerating && <ResultPanel isMobile={isMobile} />}
        </div>
      </div>
    </main>
  );
}
