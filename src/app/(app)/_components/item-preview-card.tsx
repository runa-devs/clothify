"use client";

import { clothingItems } from "@/components/clothing-items";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

interface ItemPreviewCardProps {
  selectedItemIndex: number | null;
  onClearSelection: () => void;
  onProcess: () => void;
}

export const ItemPreviewCard = ({
  selectedItemIndex,
  onClearSelection,
  onProcess,
}: ItemPreviewCardProps) => {
  const selectedItem = clothingItems.find((item) => item.id === selectedItemIndex);
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle>試着したいアイテムを選択</CardTitle>
        <CardDescription>右側のパネルからお好みのアイテムを選択してください</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex aspect-[3/4] items-center justify-center rounded-lg bg-muted p-4">
          {!!selectedItemIndex ? (
            <div className="relative size-full">
              <Image
                src={selectedItem?.sourceImage ?? ""}
                alt={selectedItem?.name ?? ""}
                fill
                className="object-contain"
              />
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
          onClick={onClearSelection}
          className="flex-1"
          disabled={selectedItemIndex === null}
        >
          選択をクリア
        </Button>
        <Button className="flex-1" onClick={onProcess} disabled={selectedItemIndex === null}>
          試着する
        </Button>
      </CardFooter>
    </Card>
  );
};
