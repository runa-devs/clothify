"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMobile } from "@/hooks/use-mobile";
import { useTryOn } from "@/hooks/use-try-on";
import { cn } from "@/lib/utils";
import { ItemGrid } from "../_components/item-grid";
import { ProcessingCard } from "../_components/processing-card";
import { ProgressBar } from "../_components/progress-bar";
import { UploadCard } from "../_components/upload-card";
import { UploadClothesCard } from "./_components/upload-clothes-card";

export default function TryOnPage() {
  const {
    step,
    payload,
    handleSelfieChange,
    handleClothesChange,
    completeStep1,
    isGenerating,
    item,
    handleItemSelect,
    progress,
    processImage,
    jobId,
    jobStatus,
    error,
  } = useTryOn();
  const { isMobile } = useMobile();

  return (
    <main className="flex flex-1 flex-col">
      {isGenerating && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" />}

      <div className="container mx-auto max-w-5xl space-y-6 px-4 pt-12 sm:pt-24">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>エラーが発生しました</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <ProgressBar step={step} className="mb-10" />

        <div
          className={cn(
            "md:grid md:gap-8",
            step === 1 && !isMobile ? "md:grid-cols-[1fr_1fr]" : "md:grid-cols-[1fr_400px]"
          )}
        >
          {/* right panel */}
          <div className="mx-auto max-w-md md:mx-0">
            {step === 1 && !isMobile && !isGenerating && (
              <>
                <UploadCard onSubmit={(file) => handleSelfieChange(file)} />
                <Button
                  className={cn("mt-6 w-full")}
                  disabled={!payload.selfieImage || (!!payload.clothesImage && !payload.category)}
                  onClick={completeStep1}
                >
                  {payload.clothesImage ? "試着する" : "商品を選択する"}
                </Button>
              </>
            )}

            {step === 1 && isMobile && !isGenerating && (
              <>
                <UploadCard onSubmit={(file) => handleSelfieChange(file)} />
                <div className="mt-6">
                  <UploadClothesCard onChange={handleClothesChange} disabled={false} />
                </div>
                <Button
                  className="mt-6 w-full"
                  disabled={!payload.selfieImage || (!!payload.clothesImage && !payload.category)}
                  onClick={completeStep1}
                >
                  {payload.clothesImage ? "試着する" : "商品を選択する"}
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
                    selectedItem={item}
                    onItemSelect={handleItemSelect}
                    className="max-h-[600px] overflow-y-auto"
                  />
                  <Button className="mt-6 w-full" disabled={!item} onClick={processImage}>
                    選択したアイテムで試着
                  </Button>
                </CardContent>
              </Card>
            )}

            {isGenerating && (
              <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
                <ProcessingCard progress={progress} jobStatus={jobStatus} />
                {jobId && (
                  <div className="mt-1 text-center text-xs text-muted-foreground">
                    ジョブID: {jobId}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* left panel */}
          {step === 1 && !isMobile && !isGenerating && (
            <div className="mx-auto mt-3 max-w-md md:mx-0">
              <UploadClothesCard onChange={handleClothesChange} disabled={false} />
            </div>
          )}
          {step === 3 && !isGenerating && <div className="mx-auto mt-3 max-w-md md:mx-0"></div>}
        </div>
      </div>
    </main>
  );
}
