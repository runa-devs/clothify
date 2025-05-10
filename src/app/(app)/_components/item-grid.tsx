"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { client } from "@/lib/hono";
import { Product } from "@/lib/scraper";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ItemGridProps {
  onItemSelect: ({ item, file }: { item: Product; file: File }) => void;
  className?: string;
  selectedItem?: Product;
}

export const ItemGrid = ({ onItemSelect, className }: ItemGridProps) => {
  const [filter, setFilter] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<number>(0);

  const onSelect = async (id: number) => {
    const product = products.find((product) => product.goodsDetailId === id);
    if (product) {
      setSelectedId(product.goodsDetailId);
      const res = await client.api.search.image.$get({
        query: {
          url: product.image,
        },
      });

      // レスポンスを直接Blobとして取得
      const blob = await res.blob();
      console.log("selected image", blob.size);
      const file = new File([blob], `${product.name}.jpg`, { type: "image/jpeg" });
      onItemSelect({ item: product, file });
      return;
    }
  };

  return (
    <div className={cn("w-full flex-1 space-y-4 p-2", className)}>
      <div className="flex flex-col items-center justify-between gap-2">
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <Input
            type="text"
            placeholder="検索"
            className="w-full"
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button
            onClick={async () => {
              if (filter) {
                const res = await client.api.search.$get({
                  query: {
                    query: filter,
                  },
                });
                const data = await res.json();
                setProducts(data.products);
                console.log(data);
              }
            }}
            variant="outline"
            size="sm"
          >
            検索
          </Button>
        </div>
      </div>

      <div className="grid max-h-[400px] grid-cols-2 gap-3 overflow-y-auto px-2 pt-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Card
            key={product.url}
            className={cn(
              "cursor-pointer border-border transition-all hover:border-primary/50",
              selectedId === product.goodsDetailId && "ring-2 ring-white"
            )}
            onClick={() => onSelect(product.goodsDetailId)}
          >
            <CardContent className="p-3">
              <div className="relative aspect-square w-full overflow-hidden rounded-md">
                <Image src={product.image215} alt={product.name} fill className="object-contain" />
              </div>
              <p className="mt-2 text-xs font-medium">{product.brandJp}</p>
              <p className="text-xs font-semibold">{product.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
