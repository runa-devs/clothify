import { clothingItems } from "@/components/clothing-items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export const RelatedProductsCard = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">よく一緒に購入されている商品</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-3">
          {clothingItems.slice(0, 4).map((item) => (
            <div key={item.id} className="cursor-pointer hover:opacity-80">
              <div className="relative mb-1 aspect-square w-full overflow-hidden rounded-md">
                <Image src={item.sourceImage} alt={item.name} fill className="object-cover" />
              </div>
              <p className="truncate text-xs font-medium">{item.name}</p>
              <p className="text-xs text-primary">¥4,290</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
