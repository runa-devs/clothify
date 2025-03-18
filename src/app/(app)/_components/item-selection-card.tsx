"use client";

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
import { ItemGrid } from "./item-grid";

interface ItemSelectionCardProps {
  selectedItem: number | null;
  onItemSelect: (index: number) => void;
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
            <Button className="w-full">アイテムを選択</Button>
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
