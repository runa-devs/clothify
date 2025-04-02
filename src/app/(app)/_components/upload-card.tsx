"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageDropzone } from "./dropzone";

interface UploadCardProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const UploadCard = ({ onFileSelect: onUpload }: UploadCardProps) => {
  return (
    <Card className="overflow-hidden border shadow-sm">
      <CardHeader className="bg-gradient-to-r from-secondary/50 to-secondary pb-4">
        <CardTitle>自撮り写真をアップロード</CardTitle>
        <CardDescription>
          高品質な試着プレビューのために、明るい場所で撮影された正面からの写真をアップロードしてください
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <ImageDropzone onFileSelect={onUpload} />
      </CardContent>
    </Card>
  );
};
