"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface UploadCardProps {
  onUpload: () => void;
}

export const UploadCard = ({ onUpload }: UploadCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle>自撮り写真をアップロード</CardTitle>
        <CardDescription>
          高品質な試着プレビューのために、明るい場所で撮影された正面からの写真をアップロードしてください
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="rounded-lg border-2 border-dashed p-10 text-center">
          <Button onClick={onUpload}>写真をアップロード</Button>
        </div>
      </CardContent>
    </Card>
  );
};
