"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// サンプル商品データ
export const sampleItems = [
  // カテゴリー1
  {
    id: 1,
    name: "カジュアルTシャツ",
    sourceImage: "/samples/source/tops/1.jpg",
    unprocessedImage: "/samples/unprocessed/tops/1.jpg",
    processedImage: "/samples/processed/tops/1.png",
    type: "トップス",
  },
  {
    id: 2,
    name: "スタイリッシュシャツ",
    sourceImage: "/samples/source/tops/2.jpg",
    unprocessedImage: "/samples/unprocessed/tops/2.jpg",
    processedImage: "/samples/processed/tops/2.png",
    type: "トップス",
  },
  {
    id: 3,
    name: "パーカー",
    sourceImage: "/samples/source/tops/3.jpg",
    unprocessedImage: "/samples/unprocessed/tops/3.jpg",
    processedImage: "/samples/processed/tops/3.png",
    type: "トップス",
  },
  {
    id: 4,
    name: "ニットセーター",
    sourceImage: "/samples/source/tops/4.jpg",
    unprocessedImage: "/samples/unprocessed/tops/4.jpg",
    processedImage: "/samples/processed/tops/4.png",
    type: "トップス",
  },
  {
    id: 5,
    name: "ブラウス",
    sourceImage: "/samples/source/tops/5.jpg",
    unprocessedImage: "/samples/unprocessed/tops/5.jpg",
    processedImage: "/samples/processed/tops/5.png",
    type: "トップス",
  },

  // パンツ
  {
    id: 6,
    name: "デニムパンツ",
    sourceImage: "/samples/source/pants/1.jpg",
    unprocessedImage: "/samples/unprocessed/pants/1.webp",
    processedImage: "/samples/processed/pants/1.png",
    type: "パンツ",
  },
  {
    id: 7,
    name: "スラックス",
    sourceImage: "/samples/source/pants/2.jpg",
    unprocessedImage: "/samples/unprocessed/pants/2.jpg",
    processedImage: "/samples/processed/pants/2.png",
    type: "パンツ",
  },
  {
    id: 8,
    name: "チノパン",
    sourceImage: "/samples/source/pants/3.jpg",
    unprocessedImage: "/samples/unprocessed/pants/3.jpg",
    processedImage: "/samples/processed/pants/3.png",
    type: "パンツ",
  },
  {
    id: 9,
    name: "ワイドパンツ",
    sourceImage: "/samples/source/pants/4.jpg",
    unprocessedImage: "/samples/unprocessed/pants/4.jpg",
    processedImage: "/samples/processed/pants/4.png",
    type: "パンツ",
  },
  {
    id: 10,
    name: "スキニーパンツ",
    sourceImage: "/samples/source/pants/5.jpg",
    unprocessedImage: "/samples/unprocessed/pants/5.jpg",
    processedImage: "/samples/processed/pants/5.png",
    type: "パンツ",
  },

  // 帽子
  {
    id: 11,
    name: "ベースボールキャップ",
    sourceImage: "/samples/source/hat/1.jpg",
    unprocessedImage: "/samples/unprocessed/hat/1.jpg",
    processedImage: "/samples/processed/hat/1.png",
    type: "帽子",
  },
  {
    id: 12,
    name: "ニット帽",
    sourceImage: "/samples/source/hat/2.jpg",
    unprocessedImage: "/samples/unprocessed/hat/2.jpg",
    processedImage: "/samples/processed/hat/2.png",
    type: "帽子",
  },
  {
    id: 13,
    name: "バケットハット",
    sourceImage: "/samples/source/hat/3.jpg",
    unprocessedImage: "/samples/unprocessed/hat/3.jpg",
    processedImage: "/samples/processed/hat/3.png",
    type: "帽子",
  },
  {
    id: 14,
    name: "フェドラハット",
    sourceImage: "/samples/source/hat/4.jpg",
    unprocessedImage: "/samples/unprocessed/hat/4.jpg",
    processedImage: "/samples/processed/hat/4.png",
    type: "帽子",
  },
  {
    id: 15,
    name: "ストローハット",
    sourceImage: "/samples/source/hat/5.jpg",
    unprocessedImage: "/samples/unprocessed/hat/5.jpg",
    processedImage: "/samples/processed/hat/5.png",
    type: "帽子",
  },

  // メガネ
  {
    id: 16,
    name: "ラウンドフレーム",
    sourceImage: "/samples/source/glasses/1.jpg",
    unprocessedImage: "/samples/unprocessed/glasses/1.jpg",
    processedImage: "/samples/processed/glasses/1.png",
    type: "メガネ",
  },
  {
    id: 17,
    name: "スクエアフレーム",
    sourceImage: "/samples/source/glasses/2.jpg",
    unprocessedImage: "/samples/unprocessed/glasses/2.jpg",
    processedImage: "/samples/processed/glasses/2.png",
    type: "メガネ",
  },
  {
    id: 18,
    name: "オーバルフレーム",
    sourceImage: "/samples/source/glasses/3.jpg",
    unprocessedImage: "/samples/unprocessed/glasses/3.jpg",
    processedImage: "/samples/processed/glasses/3.png",
    type: "メガネ",
  },
  {
    id: 19,
    name: "ボストンフレーム",
    sourceImage: "/samples/source/glasses/4.jpg",
    unprocessedImage: "/samples/unprocessed/glasses/4.jpg",
    processedImage: "/samples/processed/glasses/4.png",
    type: "メガネ",
  },
];

interface ItemGridProps {
  selectedItem: number | null;
  onItemSelect: (id: number) => void;
  itemCount?: number;
  className?: string;
}

export const ItemGrid = ({
  selectedItem,
  onItemSelect,
  itemCount = 8,
  className,
}: ItemGridProps) => {
  const [filter, setFilter] = useState<string | null>(null);

  // 表示するアイテム数を制限
  const limitedItems = sampleItems.slice(0, itemCount);

  const filteredItems = filter ? limitedItems.filter((item) => item.type === filter) : limitedItems;

  return (
    <div className={cn("flex-1 space-y-4 p-2", className)}>
      <div className="flex flex-col items-center justify-between gap-2">
        <div className="hidden flex-wrap gap-2 lg:flex">
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
              selectedItem === item.id ? "border-primary bg-accent shadow-md" : "border-border"
            )}
            onClick={() => onItemSelect(item.id)}
          >
            <CardContent className="p-3">
              <div className="relative aspect-square w-full overflow-hidden rounded-md">
                {item.sourceImage ? (
                  <Image src={item.sourceImage} alt={item.name} fill className="object-contain" />
                ) : (
                  <div className="aspect-square rounded-md bg-muted" />
                )}
                {selectedItem === item.id && (
                  <div className="absolute right-1 top-1 rounded-full bg-primary p-1 shadow-md">
                    <Sparkles className="size-3 text-white" />
                  </div>
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
