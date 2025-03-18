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

interface ResultCardProps {
  onTryAnother: () => void;
  onGoToProduct?: () => void;
}

export const ResultCard = ({ onTryAnother, onGoToProduct }: ResultCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle>試着プレビュー完成！</CardTitle>
        <CardDescription>生成された試着プレビューをご確認ください</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="aspect-[3/4] rounded-lg bg-muted" />
      </CardContent>
      <CardFooter className="flex gap-3 pb-6 pt-2">
        <Button variant="outline" onClick={onTryAnother} className="flex-1">
          別のアイテムを試す
        </Button>
        <Button className="flex-1" onClick={onGoToProduct}>
          商品ページへ
        </Button>
      </CardFooter>
    </Card>
  );
};
