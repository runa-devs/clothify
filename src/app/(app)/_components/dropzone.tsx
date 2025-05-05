"use client";

import { Button } from "@/components/ui/button";
import { ImageIcon, UploadIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";

interface ImageDropzoneProps {
  onSubmit: (file: File) => void;
  accept?: Accept;
  maxSize?: number;
}

export const ImageDropzone = ({
  onSubmit,
  accept = { "image/*": [] },
  maxSize = 5 * 1024 * 1024, // 5MB
}: ImageDropzoneProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDropAccepted = useCallback((files: File[]) => {
    const file = files[0];
    setSelectedFile(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles: 1,
    maxSize,
    onDropAccepted,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative rounded-lg border-2 border-dashed p-8 text-center 
        transition-all duration-200 ease-in-out
        ${isDragActive ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}
        ${preview ? "border-primary/40 bg-primary/5" : ""}
      `}
    >
      <input {...getInputProps()} />

      {preview ? (
        <div className="flex flex-col items-center">
          <div className="relative mb-4 size-32 overflow-hidden rounded-lg border shadow-sm">
            <Image src={preview} alt="プレビュー" fill className="object-cover" />
          </div>
          <p className="mb-1 text-sm text-muted-foreground">{selectedFile?.name}</p>
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              if (selectedFile) {
                onSubmit(selectedFile);
              }
            }}
            className="mt-3"
            type="button"
          >
            <UploadIcon className="mr-2 size-4" />
            写真をアップロード
          </Button>
        </div>
      ) : (
        <div className="py-4">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-secondary">
            <ImageIcon className="size-8 text-primary/70" />
          </div>
          <p className="mb-1 font-medium">
            {isDragActive ? "写真をここにドロップ" : "ここに写真をドロップ"}
          </p>
          <p className="text-sm text-muted-foreground">またはクリックして選択</p>
          <p className="mt-4 text-xs text-muted-foreground">
            対応形式: JPG, PNG, GIF (最大{maxSize / (1024 * 1024)}MB)
          </p>
        </div>
      )}
    </div>
  );
};
