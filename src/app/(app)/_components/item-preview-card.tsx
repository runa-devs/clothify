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

interface ItemPreviewCardProps {
  selectedItem: number | null;
  onClearSelection: () => void;
  onProcess: () => void;
}

export const ItemPreviewCard = ({
  selectedItem,
  onClearSelection,
  onProcess,
}: ItemPreviewCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle>試着したいアイテムを選択</CardTitle>
        <CardDescription>右側のパネルからお好みのアイテムを選択してください</CardDescription>
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
          onClick={onClearSelection}
          className="flex-1"
          disabled={selectedItem === null}
        >
          選択をクリア
        </Button>
        <Button className="flex-1" onClick={onProcess} disabled={selectedItem === null}>
          試着する
        </Button>
      </CardFooter>
    </Card>
  );
};
