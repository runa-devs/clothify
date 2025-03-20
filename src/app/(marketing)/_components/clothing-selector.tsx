"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { BeforeAfterSlider } from "./before-after-slider";

// 仮のサンプル衣類データ
const clothingItems = [
  // トップス
  {
    id: 1,
    name: "カジュアルTシャツ",
    sourceImage: "/samples/source/tops/1.jpg",
    unprocessedImage: "/samples/unprocessed/tops/1.jpg",
    processedImage: "/samples/processed/tops/1.jpg",
    type: "トップス",
  },
  {
    id: 2,
    name: "スタイリッシュシャツ",
    sourceImage: "/samples/source/tops/2.jpg",
    unprocessedImage: "/samples/unprocessed/tops/2.jpg",
    processedImage: "/samples/processed/tops/2.jpg",
    type: "トップス",
  },
  {
    id: 3,
    name: "パーカー",
    sourceImage: "/samples/source/tops/3.jpg",
    unprocessedImage: "/samples/unprocessed/tops/3.jpg",
    processedImage: "/samples/processed/tops/3.jpg",
    type: "トップス",
  },
  {
    id: 4,
    name: "ニットセーター",
    sourceImage: "/samples/source/tops/4.jpg",
    unprocessedImage: "/samples/unprocessed/tops/4.jpg",
    processedImage: "/samples/processed/tops/4.jpg",
    type: "トップス",
  },
  {
    id: 5,
    name: "ブラウス",
    sourceImage: "/samples/source/tops/5.jpg",
    unprocessedImage: "/samples/unprocessed/tops/5.jpg",
    processedImage: "/samples/processed/tops/5.jpg",
    type: "トップス",
  },

  // パンツ
  {
    id: 6,
    name: "デニムパンツ",
    sourceImage: "/samples/source/pants/1.jpg",
    unprocessedImage: "/samples/unprocessed/pants/1.jpg",
    processedImage: "/samples/processed/pants/1.jpg",
    type: "パンツ",
  },
  {
    id: 7,
    name: "スラックス",
    sourceImage: "/samples/source/pants/2.jpg",
    unprocessedImage: "/samples/unprocessed/pants/2.jpg",
    processedImage: "/samples/processed/pants/2.jpg",
    type: "パンツ",
  },
  {
    id: 8,
    name: "チノパン",
    sourceImage: "/samples/source/pants/3.jpg",
    unprocessedImage: "/samples/unprocessed/pants/3.jpg",
    processedImage: "/samples/processed/pants/3.jpg",
    type: "パンツ",
  },
  {
    id: 9,
    name: "ワイドパンツ",
    sourceImage: "/samples/source/pants/4.jpg",
    unprocessedImage: "/samples/unprocessed/pants/4.jpg",
    processedImage: "/samples/processed/pants/4.jpg",
    type: "パンツ",
  },
  {
    id: 10,
    name: "スキニーパンツ",
    sourceImage: "/samples/source/pants/5.jpg",
    unprocessedImage: "/samples/unprocessed/pants/5.jpg",
    processedImage: "/samples/processed/pants/5.jpg",
    type: "パンツ",
  },

  // 帽子
  {
    id: 11,
    name: "ベースボールキャップ",
    sourceImage: "/samples/source/hat/1.jpg",
    unprocessedImage: "/samples/unprocessed/hat/1.jpg",
    processedImage: "/samples/processed/hat/1.jpg",
    type: "帽子",
  },
  {
    id: 12,
    name: "ニット帽",
    sourceImage: "/samples/source/hat/2.jpg",
    unprocessedImage: "/samples/unprocessed/hat/2.jpg",
    processedImage: "/samples/processed/hat/2.jpg",
    type: "帽子",
  },
  {
    id: 13,
    name: "バケットハット",
    sourceImage: "/samples/source/hat/3.jpg",
    unprocessedImage: "/samples/unprocessed/hat/3.jpg",
    processedImage: "/samples/processed/hat/3.jpg",
    type: "帽子",
  },
  {
    id: 14,
    name: "フェドラハット",
    sourceImage: "/samples/source/hat/4.jpg",
    unprocessedImage: "/samples/unprocessed/hat/4.jpg",
    processedImage: "/samples/processed/hat/4.jpg",
    type: "帽子",
  },
  {
    id: 15,
    name: "ストローハット",
    sourceImage: "/samples/source/hat/5.jpg",
    unprocessedImage: "/samples/unprocessed/hat/5.jpg",
    processedImage: "/samples/processed/hat/5.jpg",
    type: "帽子",
  },

  // メガネ
  {
    id: 16,
    name: "ラウンドフレーム",
    sourceImage: "/samples/source/glasses/1.jpg",
    unprocessedImage: "/samples/unprocessed/glasses/1.jpg",
    processedImage: "/samples/processed/glasses/1.jpg",
    type: "メガネ",
  },
  {
    id: 17,
    name: "スクエアフレーム",
    sourceImage: "/samples/source/glasses/2.jpg",
    unprocessedImage: "/samples/unprocessed/glasses/2.jpg",
    processedImage: "/samples/processed/glasses/2.jpg",
    type: "メガネ",
  },
  {
    id: 18,
    name: "オーバルフレーム",
    sourceImage: "/samples/source/glasses/3.jpg",
    unprocessedImage: "/samples/unprocessed/glasses/3.jpg",
    processedImage: "/samples/processed/glasses/3.jpg",
    type: "メガネ",
  },
  {
    id: 19,
    name: "ボストンフレーム",
    sourceImage: "/samples/source/glasses/4.jpg",
    unprocessedImage: "/samples/unprocessed/glasses/4.jpg",
    processedImage: "/samples/processed/glasses/4.jpg",
    type: "メガネ",
  },
  {
    id: 20,
    name: "ウェリントンフレーム",
    sourceImage: "/samples/source/glasses/5.jpg",
    unprocessedImage: "/samples/unprocessed/glasses/5.jpg",
    processedImage: "/samples/processed/glasses/5.jpg",
    type: "メガネ",
  },
];

interface ClothingSelectorProps {
  className?: string;
}

export const ClothingSelector = ({ className }: ClothingSelectorProps) => {
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedClothing, setSelectedClothing] = useState<(typeof clothingItems)[0] | null>(null);

  const filteredItems = filter
    ? clothingItems.filter((item) => item.type === filter)
    : clothingItems;

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row">
      {/* 左側: BeforeAfterスライダー（未加工とバーチャル試着比較） */}
      <div className="flex-1">
        <div className="mx-auto max-w-md">
          <BeforeAfterSlider
            beforeImage={selectedClothing ? selectedClothing.unprocessedImage : "/sample1.jpg"}
            afterImage={selectedClothing ? selectedClothing.processedImage : "/sample2.jpg"}
          />
          {selectedClothing && (
            <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-muted/30 p-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="relative size-10 overflow-hidden rounded-md border border-border">
                  <Image
                    src={selectedClothing.unprocessedImage}
                    alt={selectedClothing.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedClothing.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedClothing.type}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setSelectedClothing(null)}
              >
                リセット
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 右側: 洋服選択UI */}
      <div className={cn("flex-1 space-y-4", className)}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">アイテムを選択</h3>
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
                "cursor-pointer transition-all hover:border-chart-5/50",
                selectedClothing?.id === item.id
                  ? "border-chart-5 bg-chart-5/5 shadow-md"
                  : "border-border"
              )}
              onClick={() => setSelectedClothing(item)}
            >
              <CardContent className="p-3">
                <div className="relative aspect-square w-full overflow-hidden rounded-md">
                  <Image src={item.sourceImage} alt={item.name} fill className="object-contain" />
                  {selectedClothing?.id === item.id && (
                    <div className="absolute right-1 top-1 rounded-full bg-chart-5 p-1 shadow-md">
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
    </div>
  );
};
