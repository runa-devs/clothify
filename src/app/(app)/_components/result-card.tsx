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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Facebook, Share2, Star, StarHalf, Truck, Twitter } from "lucide-react";
import { useEffect } from "react";
import { BeforeAfterSlider } from "../../(marketing)/_components/before-after-slider";

interface ResultCardProps {
  onTryAnother: () => void;
  onGoToProduct?: () => void;
  beforeImage?: string;
  afterImage?: string;
  itemName?: string;
  itemType?: string;
}

export const ResultCard = ({
  onTryAnother,
  onGoToProduct,
  beforeImage = "/samples/unprocessed/tops/1.jpg",
  afterImage = "/samples/processed/tops/1.png",
  itemName = "カジュアルTシャツ",
  itemType = "トップス",
}: ResultCardProps) => {
  // 結果表示時に選択中のアイテム情報をコンソールに表示
  useEffect(() => {
    console.log("ResultCard - 表示アイテム:", {
      itemName,
      itemType,
      beforeImage,
      afterImage,
    });
  }, [itemName, itemType, beforeImage, afterImage]);

  const shareOnTwitter = () => {
    const text = `${itemName}をClothifyでバーチャル試着してみました！`;
    const url = window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareOnFacebook = () => {
    const url = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>試着プレビュー完成！</CardTitle>
            <CardDescription>生成された試着プレビューをご確認ください</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="size-9">
                <Share2 className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={shareOnTwitter} className="cursor-pointer">
                <Twitter className="mr-2 size-4" />
                <span>Twitterでシェア</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareOnFacebook} className="cursor-pointer">
                <Facebook className="mr-2 size-4" />
                <span>Facebookでシェア</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mx-auto max-w-md">
          <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} />
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-2 text-sm">
              <div className="flex items-center gap-2">
                <div>
                  <p className="font-medium">{itemName}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>{itemType}</span>
                    <span className="mx-1">•</span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="size-3 fill-current" />
                      <Star className="size-3 fill-current" />
                      <Star className="size-3 fill-current" />
                      <Star className="size-3 fill-current" />
                      <StarHalf className="size-3 fill-current" />
                      <span className="ml-1 text-muted-foreground">(4.5)</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <p className="font-medium text-primary">¥5,980</p>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[10px]">
                    送料無料
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  <Truck className="size-3" />
                  <span>即日発送 • 在庫あり</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-2 text-xs">
              <div className="mb-1.5 flex justify-between">
                <span className="font-medium">カラー</span>
                <span className="text-muted-foreground">3色展開</span>
              </div>
              <div className="flex gap-1">
                <div className="size-5 rounded-full border border-border bg-black"></div>
                <div className="size-5 rounded-full border border-border bg-white"></div>
                <div className="size-5 rounded-full border border-border bg-blue-500"></div>
              </div>
              <div className="mt-2 text-[11px] text-muted-foreground">
                この30分で12人がこの商品を購入しました
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 pb-6 pt-2">
        <Button variant="outline" onClick={onTryAnother} className="flex-1">
          別のアイテムを試す
        </Button>
        <Button
          className="flex-1 bg-primary transition-colors hover:bg-primary/90"
          onClick={() => {
            console.log(`商品「${itemName}」の商品ページへ移動します`);
            onGoToProduct?.();
          }}
        >
          商品ページへ
        </Button>
      </CardFooter>
    </Card>
  );
};
