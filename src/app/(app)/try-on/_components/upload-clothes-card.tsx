"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ImageDropzone } from "../../_components/dropzone";

const formSchema = z.object({
  imageFile: z.instanceof(File).optional(),
  category: z.enum([
    "face",
    "hair",
    "hat",
    "sunglass",
    "left_arm",
    "right_arm",
    "left_leg",
    "right_leg",
    "upper_clothes",
    "skirt",
    "pants",
    "dress",
    "belt",
    "shoe",
    "bag",
    "scarf",
  ]),
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
      category: undefined,
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

            <Label htmlFor="category">カテゴリ</Label>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        onChange({
                          ...form.getValues(),
                          category: value as ClothesFormValues["category"],
                        });
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="face">顔</SelectItem>
                        <SelectItem value="hair">髪</SelectItem>
                        <SelectItem value="hat">帽子</SelectItem>
                        <SelectItem value="sunglass">サングラス</SelectItem>
                        <SelectItem value="left_arm">左腕</SelectItem>
                        <SelectItem value="right_arm">右腕</SelectItem>
                        <SelectItem value="left_leg">左脚</SelectItem>
                        <SelectItem value="right_leg">右脚</SelectItem>
                        <SelectItem value="upper_clothes">トップス</SelectItem>
                        <SelectItem value="skirt">スカート</SelectItem>
                        <SelectItem value="pants">パンツ</SelectItem>
                        <SelectItem value="dress">ドレス</SelectItem>
                        <SelectItem value="belt">ベルト</SelectItem>
                        <SelectItem value="shoe">靴</SelectItem>
                        <SelectItem value="bag">バッグ</SelectItem>
                        <SelectItem value="scarf">スカーフ</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
