"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageInputCard } from "../_components/image-input-card";
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
    isModelImageUploaded,
    isClothingImageUploaded,
    isDrawerOpen,
    setIsDrawerOpen,
    selectedItem,
    selectedItemData,
    processImage,
    handleItemSelect,
    clearSelection,
    goToProduct,
    handleFileSubmit,
    handleNextStep,
    handleTryAnother,
    handleUrlChange,
    handleUrlSubmit,
    isUrlValid,
    urlError,
  } = useTryOn();

  const canProceedToNextStep = isModelImageUploaded;

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
            {step === 1 && !isMobile && (
              <>
                <UploadCard
                  onSubmit={(file) => handleFileSubmit(file, true)}
                  disabled={isModelImageUploaded}
                />
                <Button
                  className={cn("mt-6 w-full")}
                  disabled={!canProceedToNextStep}
                  onClick={handleNextStep}
                >
                  次に進む
                </Button>
              </>
            )}

            {step === 1 && isMobile && (
              <>
                <UploadCard
                  onSubmit={(file) => handleFileSubmit(file, true)}
                  disabled={isModelImageUploaded}
                />
                <div className="mt-6">
                  <ImageInputCard
                    onSubmit={(file) => handleFileSubmit(file, false)}
                    isClothingImageUploaded={isClothingImageUploaded}
                    disabled={isClothingImageUploaded}
                    onInputChange={handleUrlChange}
                    handleUrlSubmit={handleUrlSubmit}
                    isUrlValid={isUrlValid}
                    urlError={urlError}
                  />
                </div>
                <Button
                  className="mt-6 w-full"
                  disabled={!canProceedToNextStep}
                  onClick={handleNextStep}
                >
                  次に進む
                </Button>
              </>
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

          {step === 1 && !isMobile && (
            <div className="mx-auto mt-3 max-w-md md:mx-0">
              <ImageInputCard
                onSubmit={(file) => handleFileSubmit(file, false)}
                isClothingImageUploaded={isClothingImageUploaded}
                disabled={isClothingImageUploaded}
                onInputChange={handleUrlChange}
                handleUrlSubmit={handleUrlSubmit}
                isUrlValid={isUrlValid}
                urlError={urlError}
              />
            </div>
          )}

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
