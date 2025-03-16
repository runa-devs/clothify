"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function TryOnPage() {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

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
  };

  const clearSelection = () => {
    setSelectedItem(null);
  };

  // Item selection component
  const ItemGrid = () => (
    <div className="grid grid-cols-2 gap-4 p-2 md:grid-cols-2">
      {/* Mock items */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Card
          key={i}
          className={cn(
            "cursor-pointer transition-colors",
            selectedItem === i ? "border-primary bg-accent" : "hover:bg-accent/50"
          )}
          onClick={() => handleItemSelect(i)}
        >
          <CardContent className="p-3">
            <div className="mb-2 aspect-square rounded-md bg-muted" />
            <p className="text-sm">アイテム {i + 1}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4">
      <div className="mx-auto mb-10 flex max-w-md items-center gap-4">
        <Progress value={((step - 1) / 3) * 100} className="w-full" />
        <span className="whitespace-nowrap text-sm text-muted-foreground">Step {step}/3</span>
      </div>

      <div
        className={cn(
          "md:grid md:gap-8",
          step === 1 && !isMobile ? "md:grid-cols-[1fr_1fr]" : "md:grid-cols-[1fr_400px]"
        )}
      >
        <div className="mx-auto max-w-md md:mx-0">
          {step === 1 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle>自撮り写真をアップロード</CardTitle>
                <CardDescription>
                  高品質な試着プレビューのために、明るい場所で撮影された正面からの写真をアップロードしてください
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="rounded-lg border-2 border-dashed p-10 text-center">
                  <Button onClick={() => setStep(2)}>写真をアップロード</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && isMobile && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle>試着したいアイテムを選択</CardTitle>
                <CardDescription>お好みのアイテムを選択してください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                  <DrawerTrigger asChild>
                    <Button className="w-full">アイテムを選択</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>アイテム一覧</DrawerTitle>
                      <DrawerDescription>試着したいアイテムを選んでください</DrawerDescription>
                    </DrawerHeader>
                    <ScrollArea className="h-[50vh]">
                      <ItemGrid />
                    </ScrollArea>
                    <DrawerFooter className="pt-4">
                      <Button onClick={() => processImage()} disabled={selectedItem === null}>
                        選択したアイテムで試着
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </CardContent>
            </Card>
          )}

          {step === 2 && !isMobile && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle>試着したいアイテムを選択</CardTitle>
                <CardDescription>
                  右側のパネルからお好みのアイテムを選択してください
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex aspect-[3/4] items-center justify-center rounded-lg bg-muted">
                  {selectedItem !== null ? (
                    <div className="text-center">
                      <p className="font-medium">アイテム {selectedItem + 1}</p>
                      <p className="text-sm text-muted-foreground">選択済み</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-muted-foreground">
                        アイテムを選択すると、
                        <br />
                        ここにプレビューが表示されます
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex gap-3 pb-6 pt-2">
                <Button
                  variant="outline"
                  onClick={clearSelection}
                  className="flex-1"
                  disabled={selectedItem === null}
                >
                  選択をクリア
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => processImage()}
                  disabled={selectedItem === null}
                >
                  試着する
                </Button>
              </CardFooter>
            </Card>
          )}

          {isProcessing && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle>画像を生成中...</CardTitle>
                <CardDescription>高品質な試着プレビューを生成しています</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <Progress value={progress} className="w-full" />
              </CardContent>
            </Card>
          )}

          {step === 3 && !isProcessing && (
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle>試着プレビュー完成！</CardTitle>
                <CardDescription>生成された試着プレビューをご確認ください</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="aspect-[3/4] rounded-lg bg-muted" />
              </CardContent>
              <CardFooter className="flex gap-3 pb-6 pt-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  別のアイテムを試す
                </Button>
                <Button className="flex-1">商品ページへ</Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {step === 1 && !isMobile && (
          <Card className={cn("h-fit shadow-sm md:block", isMobile ? "hidden" : "sticky top-6")}>
            <CardHeader className="pb-4">
              <CardTitle>Clothifyについて</CardTitle>
              <CardDescription>AIを活用した洋服の試着サービス</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pb-6">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 font-medium">簡単3ステップで試着</h3>
                <ol className="ml-5 list-decimal space-y-2 text-sm text-muted-foreground">
                  <li>自撮り写真をアップロード</li>
                  <li>試着したいアイテムを選択</li>
                  <li>AIが高品質な試着画像を生成</li>
                </ol>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <h3 className="mb-2 font-medium">特徴</h3>
                <ul className="ml-5 list-disc space-y-2 text-sm text-muted-foreground">
                  <li>高品質な試着プレビュー</li>
                  <li>多様なアイテムから選択可能</li>
                  <li>スマホでも簡単に操作</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && !isMobile && (
          <Card className={cn("h-fit shadow-sm md:block", isMobile ? "hidden" : "sticky top-6")}>
            <CardHeader className="pb-4">
              <CardTitle>アイテム一覧</CardTitle>
              <CardDescription>試着したいアイテムを選んでください</CardDescription>
            </CardHeader>
            <ScrollArea className="h-[60vh]">
              <ItemGrid />
            </ScrollArea>
            <CardFooter className="pb-6 pt-4">
              <Button
                onClick={() => processImage()}
                className="w-full"
                disabled={selectedItem === null}
              >
                選択したアイテムで試着
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
