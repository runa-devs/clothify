"use client";

import { clothingItems } from "@/components/clothing-items";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import Image from "next/image";
import { ItemGrid } from "./item-grid";

interface ItemSelectionCardProps {
  selectedItem?: string;
  onItemSelect: (item: (typeof clothingItems)[0]) => void;
  onProcess: () => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

export const ItemSelectionCard = ({
  selectedItem,
  onItemSelect,
  onProcess,
  isDrawerOpen,
  setIsDrawerOpen,
}: ItemSelectionCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle>試着したいアイテムを選択</CardTitle>
        <CardDescription>お好みのアイテムを選択してください</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-center rounded-md bg-muted p-3">
                {selectedItem ? (
                  <Image
                    src={
                      clothingItems.find((item) => item.name === selectedItem)?.sourceImage ?? ""
                    }
                    alt={selectedItem ?? ""}
                    width={300}
                    height={400}
                    className="rounded-md"
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                    <Plus className="size-4" />
                  </div>
                )}
              </div>
              {selectedItem && (
                <div className="flex justify-center">
                  <Button variant="secondary" className="w-full">
                    別のアイテムを選択
                  </Button>
                </div>
              )}
            </div>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>アイテム一覧</DrawerTitle>
              <DrawerDescription>試着したいアイテムを選んでください</DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="h-[50vh]">
              <ItemGrid selectedItem={selectedItem} onItemSelect={onItemSelect} />
            </ScrollArea>
            <DrawerFooter className="pt-4">
              <Button onClick={onProcess} disabled={selectedItem === null}>
                選択したアイテムで試着
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </CardContent>
    </Card>
  );
};
