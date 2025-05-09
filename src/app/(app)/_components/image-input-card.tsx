"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";
import { ImageDropzone } from "./dropzone";

interface ItemSelectionCardProps {
  onSubmit: (file: File) => void;
  disabled: boolean;
  isClothingImageUploaded: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUrlSubmit: () => void;
  isUrlValid?: boolean;
  urlError?: string;
}

export const ImageInputCard = ({
  onSubmit,
  isClothingImageUploaded,
  disabled,
  onInputChange,
  handleUrlSubmit,
  isUrlValid = true,
  urlError = "",
}: ItemSelectionCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-secondary/50 to-secondary pb-4">
        <CardTitle>試着したい写真をアップロード</CardTitle>
        <CardDescription>試着したい服のURLか写真をアップロードしてください</CardDescription>
      </CardHeader>
      <CardContent className="mt-3 space-y-4 pb-6">
        <p className="text-sm text-muted-foreground">アップロード</p>
        <ImageDropzone onSubmit={onSubmit} disabled={disabled} />
        <p className="text-sm text-muted-foreground">URL</p>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              disabled={isClothingImageUploaded}
              type="text"
              placeholder="URLを入力してください"
              onChange={onInputChange}
              className={!isUrlValid ? "border-red-500" : ""}
            />
            <Button
              onClick={handleUrlSubmit}
              disabled={isClothingImageUploaded}
              variant="secondary"
              size="icon"
            >
              <SendIcon size={16} />
            </Button>
          </div>
          {!isUrlValid && urlError && <p className="text-xs text-red-500">{urlError}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
