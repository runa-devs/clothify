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
import { Facebook, Share2, Twitter } from "lucide-react";
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
          <div className="mt-3 flex items-center justify-between rounded-lg border border-border bg-muted/30 p-2 text-sm">
            <div className="flex items-center gap-2">
              <div>
                <p className="font-medium">{itemName}</p>
                <p className="text-xs text-muted-foreground">{itemType}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3 pb-6 pt-2">
        <Button variant="outline" onClick={onTryAnother} className="flex-1">
          別のアイテムを試す
        </Button>
        <Button className="flex-1" onClick={onGoToProduct}>
          商品ページへ
        </Button>
      </CardFooter>
    </Card>
  );
};
