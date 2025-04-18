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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ItemGrid } from "./item-grid";

interface ItemsPanelProps {
  selectedItem: number | null;
  onItemSelect: (index: number) => void;
  onProcess: () => void;
  isMobile: boolean;
  className?: string;
}

export const ItemsPanel = ({
  selectedItem,
  onItemSelect,
  onProcess,
  isMobile,
  className,
}: ItemsPanelProps) => {
  return (
    <Card
      className={cn("h-fit shadow-sm md:block", isMobile ? "hidden" : "sticky top-6", className)}
    >
      <CardHeader className="pb-4">
        <CardTitle>アイテム一覧</CardTitle>
        <CardDescription>試着したいアイテムを選んでください</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ScrollArea className="h-full">
          <ItemGrid selectedItem={selectedItem} onItemSelect={onItemSelect} />
        </ScrollArea>
      </CardContent>
      <CardFooter className="pb-6">
        <Button onClick={onProcess} className="hidden w-full" disabled={selectedItem === null}>
          選択したアイテムで試着
        </Button>
      </CardFooter>
    </Card>
  );
};
