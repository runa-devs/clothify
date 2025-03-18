"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ProcessingCardProps {
  progress: number;
}

export const ProcessingCard = ({ progress }: ProcessingCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle>画像を生成中...</CardTitle>
        <CardDescription>高品質な試着プレビューを生成しています</CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <Progress value={progress} className="w-full" />
      </CardContent>
    </Card>
  );
};
