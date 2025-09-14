"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImageDropzone } from "../../_components/dropzone";

const formSchema = z.object({
  imageFile: z.instanceof(File).optional(),
});

export type ClothesFormValues = z.infer<typeof formSchema>;

interface UploadClothesCardProps {
  onChange: (values: ClothesFormValues) => void;
  disabled: boolean;
  handleUrlSubmit?: (url: string) => void;
}

export const UploadClothesCard = ({ onChange, disabled }: UploadClothesCardProps) => {
  const form = useForm<ClothesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageFile: undefined,
    },
  });

  const handleFileSubmit = (file: File) => {
    form.setValue("imageFile", file);
    onChange({ ...form.getValues(), imageFile: file });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-secondary/50 to-secondary pb-4">
        <CardTitle>試着したい写真をアップロード</CardTitle>
        <CardDescription>試着したい服のURLか写真をアップロードしてください</CardDescription>
      </CardHeader>
      <CardContent className="mt-3 space-y-4 pb-6">
        <Form {...form}>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <Label htmlFor="imageFile">アップロード</Label>
            <ImageDropzone onSubmit={handleFileSubmit} disabled={disabled} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
