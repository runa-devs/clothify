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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Facebook, Share2, Twitter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BeforeAfterSlider } from "../../(marketing)/_components/before-after-slider";

interface ResultCardProps {
  onTryAnother: () => void;
  onGoToProduct?: () => void;
  beforeImage?: string;
  afterImage?: string;
  itemName?: string;
  itemType?: string;
  isShared?: boolean;
  onToggleShare?: () => void;
  shareUrl?: string;
  isMarketplace?: boolean;
  itemUrl?: string;
}

export const ResultCard = ({
  onGoToProduct,
  beforeImage = "/samples/unprocessed/tops/1. jpg",
  afterImage = "/samples/processed/tops/1.png",
  itemName = "カジュアルTシャツ",
  itemType = "トップス",
  isShared = false,
  onToggleShare,
  shareUrl = "",
  itemUrl = "",
}: ResultCardProps) => {
  const router = useRouter();
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
    const url = shareUrl || window.location.href;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const shareOnFacebook = () => {
    const url = shareUrl || window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const copyToClipboard = () => {
    const url = shareUrl || window.location.href;
    navigator.clipboard.writeText(url);
    alert("URLをクリップボードにコピーしました");
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
              <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
                <Share2 className="mr-2 size-4" />
                <span>URLをコピー</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mx-auto max-w-md">
          <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} />
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3 text-sm">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="share-mode" className="font-medium">
                  結果を共有する
                </Label>
                <p className="text-xs text-muted-foreground">
                  オンにすると結果ページを他の人と共有できます
                </p>
              </div>
              <Switch id="share-mode" checked={isShared} onCheckedChange={onToggleShare} />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 pb-6 pt-2">
        <Button onClick={() => router.push("/")} className="flex-1">
          ホームに戻る
        </Button>
        <Button
          className="flex-1 bg-primary transition-colors hover:bg-primary/90"
          onClick={() => {
            console.log(`${itemUrl}へ移動します`);
            onGoToProduct?.();
          }}
        >
          商品ページへ
        </Button>
      </CardFooter>
    </Card>
  );
};
