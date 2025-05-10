"use client";

import { clothingItems } from "@/components/clothing-items";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ItemGridProps {
  selectedItem?: string;
  onItemSelect: (item: (typeof clothingItems)[0]) => void;
  className?: string;
}

export const ItemGrid = ({ selectedItem, onItemSelect, className }: ItemGridProps) => {
  const [filter, setFilter] = useState<string | null>(null);

  const filteredItems = clothingItems.filter((item) => item.type === filter || !filter);

  const onSelect = (id: number) => {
    onItemSelect(clothingItems[id - 1]);
  };

  return (
    <div className={cn("flex-1 space-y-4 p-2", className)}>
      <div className="flex flex-col items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filter === null ? "default" : "outline"}
            onClick={() => setFilter(null)}
            className="text-xs"
          >
            すべて
          </Button>
          <Button
            size="sm"
            variant={filter === "トップス" ? "default" : "outline"}
            onClick={() => setFilter("トップス")}
            className="text-xs"
          >
            トップス
          </Button>
          <Button
            size="sm"
            variant={filter === "パンツ" ? "default" : "outline"}
            onClick={() => setFilter("パンツ")}
            className="text-xs"
          >
            パンツ
          </Button>
          <Button
            size="sm"
            variant={filter === "帽子" ? "default" : "outline"}
            onClick={() => setFilter("帽子")}
            className="text-xs"
          >
            帽子
          </Button>
          <Button
            size="sm"
            variant={filter === "メガネ" ? "default" : "outline"}
            onClick={() => setFilter("メガネ")}
            className="text-xs"
          >
            メガネ
          </Button>
        </div>
      </div>

      <div className="grid max-h-[400px] grid-cols-2 gap-3 overflow-y-auto pr-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "cursor-pointer transition-all hover:border-primary/50",
              selectedItem === item.name ? "border-primary bg-accent shadow-md" : "border-border"
            )}
            onClick={() => onSelect(item.id)}
          >
            <CardContent className="p-3">
              <div className="relative aspect-square w-full overflow-hidden rounded-md">
                {item.sourceImage ? (
                  <Image src={item.sourceImage} alt={item.name} fill className="object-contain" />
                ) : (
                  <div className="aspect-square rounded-md bg-muted" />
                )}
              </div>
              <p className="mt-2 text-xs font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.type}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
