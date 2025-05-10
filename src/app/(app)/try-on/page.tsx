"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ImageInputCard } from "../_components/image-input-card";
import { ItemGrid } from "../_components/item-grid";
import { ProcessingCard } from "../_components/processing-card";
import { ProgressBar } from "../_components/progress-bar";
import { ResultCard } from "../_components/result-card";
import { UploadCard } from "../_components/upload-card";
import { useTryOn } from "./hooks/useTryOn";

export default function TryOnPage() {
  const {
    step,
    isGenerating,
    progress,
    isMobile,
    isModelImageUploaded,
    isClothingImageUploaded,
    selectedItem,
    selectedItemData,
    goToProduct,
    handleFileSubmit,
    handleNextStep,
    handleTryAnother,
    handleUrlChange,
    handleUrlSubmit,
    isUrlValid,
    urlError,
    isShared,
    toggleShare,
    shareResult,
    handleItemSelect,
    processImage,
  } = useTryOn();

  const canProceedToNextStep = isModelImageUploaded;
  const shareUrl = shareResult();

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
                  {isClothingImageUploaded ? "試着する" : "商品を選択する"}
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
                  {isClothingImageUploaded ? "試着する" : "商品を選択する"}
                </Button>
              </>
            )}

            {step === 2 && !isGenerating && (
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle>試着したいアイテムを選択</CardTitle>
                  <CardDescription>お好みのアイテムを選択して試着してみましょう</CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <ItemGrid
                    selectedItem={selectedItem}
                    onItemSelect={handleItemSelect}
                    className="max-h-[600px] overflow-y-auto"
                  />
                  <Button
                    className="mt-6 w-full"
                    disabled={selectedItem === null}
                    onClick={processImage}
                  >
                    選択したアイテムで試着
                  </Button>
                </CardContent>
              </Card>
            )}

            {isGenerating && (
              <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
                <ProcessingCard progress={progress} />
              </div>
            )}

            {step === 3 && !isGenerating && (
              <ResultCard
                onTryAnother={handleTryAnother}
                onGoToProduct={goToProduct}
                beforeImage={selectedItemData?.unprocessedImage}
                afterImage={selectedItemData?.processedImage}
                itemName={selectedItemData?.name}
                itemType={selectedItemData?.type}
                isShared={isShared}
                onToggleShare={toggleShare}
                shareUrl={shareUrl}
              />
            )}
          </div>

          {step === 3 && !isGenerating && (
            <div className="mx-auto mt-3 max-w-md md:mx-0">
              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle>商品情報</CardTitle>
                  <CardDescription>
                    アイテムの詳細情報 ユーザー入力の画像のため詳細情報はありません
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">{selectedItemData?.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedItemData?.type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="mt-4 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle>ショップ</CardTitle>
                  <CardDescription>
                    アイテムの詳細情報 ユーザー入力の画像のためショップ情報はありません
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">{selectedItemData?.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedItemData?.type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
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
        </div>
      </div>
    </main>
  );
}
