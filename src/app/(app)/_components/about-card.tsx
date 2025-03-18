"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AboutCardProps {
  isMobile: boolean;
  className?: string;
}

export const AboutCard = ({ isMobile, className }: AboutCardProps) => {
  return (
    <Card
      className={cn("h-fit shadow-sm md:block", isMobile ? "hidden" : "sticky top-6", className)}
    >
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
  );
};
