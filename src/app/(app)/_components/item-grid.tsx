"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ItemGridProps {
  selectedItem: number | null;
  onItemSelect: (index: number) => void;
  itemCount?: number;
}

export const ItemGrid = ({ selectedItem, onItemSelect, itemCount = 8 }: ItemGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-2 md:grid-cols-2">
      {Array.from({ length: itemCount }).map((_, i) => (
        <Card
          key={i}
          className={cn(
            "cursor-pointer transition-colors",
            selectedItem === i ? "border-primary bg-accent" : "hover:bg-accent/50"
          )}
          onClick={() => onItemSelect(i)}
        >
          <CardContent className="p-3">
            <div className="mb-2 aspect-square rounded-md bg-muted" />
            <p className="text-sm">アイテム {i + 1}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
