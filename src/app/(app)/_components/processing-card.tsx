"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Camera, Clock, Loader2, Shirt, Sparkles, Star, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ProcessingCardProps {
  progress: number;
  jobStatus?: string | null;
}

export const ProcessingCard = ({ progress, jobStatus }: ProcessingCardProps) => {
  const [loadingText, setLoadingText] = useState("スタイルを分析中...");
  const [currentStep, setCurrentStep] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [funFacts] = useState<string[]>([
    "衣服は、食事や住居と並ぶ人間の基本的な必需品の一つです。",
    "多くの消費者が、自分に本当にフィットする服を見つけるのに苦労しています。",
    "ある調査では、消費者の60%以上が店頭でぴったりの服を見つけられないと回答しました。",
    "ファッションにおけるサイズの多様性は、多くの人にとって重要な関心事です。",
    "自分に合うサイズの服を選ぶことは、満足のいく購買体験に繋がります。",
    "オンラインでの試着体験は、購入後の返品率を減らす効果も期待されています。",
    "ファッション業界では、より多くの人に合う製品を提供するための技術革新が進んでいます。",
    "ソーシャルメディアは、ファッションのトレンドや多様な意見が共有される場となっています。",
  ]);
  const [currentFact, setCurrentFact] = useState(0);

  useEffect(() => {
    const steps = [
      "スタイルを分析中...",
      "試着データを準備中...",
      "衣服を適合中...",
      "仕上げの調整中...",
      "最終結果を生成中...",
    ];

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % steps.length;
        setLoadingText(steps[next]);
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 7000);

    return () => clearInterval(factInterval);
  }, [funFacts.length]);

  const getStepIcon = (step: number) => {
    switch (step) {
      case 0:
        return <Camera className="animate-pulse" />;
      case 1:
        return <Shirt className="animate-pulse" />;
      case 2:
        return <Wand2 className="animate-pulse" />;
      case 3:
        return <Loader2 className="animate-spin" />;
      case 4:
        return <Sparkles className="animate-pulse" />;
      default:
        return <Loader2 className="animate-spin" />;
    }
  };

  const formatTimeLeft = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-96 border border-muted/30 bg-card/80 shadow-lg backdrop-blur-sm">
      <CardHeader className="relative pb-2">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded-full bg-primary p-3 text-primary-foreground">
          {getStepIcon(currentStep)}
        </div>
        <div className="pt-6">
          <CardTitle className="text-center">AI試着処理中</CardTitle>
          <CardDescription className="mt-1 text-center">{loadingText}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pb-6">
        <div className="flex justify-center py-4">
          <div className="relative flex h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-primary/5 to-background">
            <div className="absolute size-20 animate-ping rounded-full bg-primary/10" />

            <div className="absolute z-10">
              <Shirt size={56} className="animate-[bounce_2s_ease-in-out_infinite] text-primary" />
            </div>

            <div className="absolute left-1/4 top-1/4 size-2 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-primary" />
            <div className="absolute right-1/3 top-1/3 size-3 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-primary/70" />
            <div className="absolute bottom-1/4 right-1/4 size-2 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-primary/50" />

            <div className="absolute right-1/4 top-[20%] animate-[pulse_3s_ease-in-out_infinite]">
              <Star size={12} className="fill-primary/80 text-primary" />
            </div>
            <div className="absolute bottom-1/3 left-1/3 animate-[pulse_2.5s_ease-in-out_infinite]">
              <Star size={10} className="fill-primary/70 text-primary" />
            </div>
            <div className="absolute bottom-[20%] left-1/4 animate-[pulse_4s_ease-in-out_infinite]">
              <Star size={14} className="fill-primary/60 text-primary" />
            </div>

            <div className="absolute -z-10 size-40 animate-[spin_20s_linear_infinite] rounded-full border border-dashed border-primary/30" />
            <div className="absolute -z-10 size-24 animate-[spin_15s_linear_infinite_reverse] rounded-full border border-dotted border-primary/20" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              <span>残り約 {formatTimeLeft()}</span>
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 w-full" />
        </div>

        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-5 gap-1">
            {[0, 1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-1.5 rounded-full",
                  currentStep >= step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-lg bg-muted/30 p-3">
            <p className="text-center text-xs text-muted-foreground transition-opacity duration-500">
              <span className="font-medium text-primary">豆知識:</span> {funFacts[currentFact]}
            </p>
          </div>

          {jobStatus && (
            <div className="text-center text-sm font-medium text-muted-foreground">
              ステータス: {jobStatus}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
