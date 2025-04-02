import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ProductDetailCard = () => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">商品詳細</CardTitle>
      </CardHeader>
      <CardContent className="pb-3 text-sm">
        <div className="space-y-4">
          <div>
            <h4 className="mb-1 font-medium">素材</h4>
            <p className="text-muted-foreground">綿100%、高品質な素材を使用</p>
          </div>
          <div>
            <h4 className="mb-1 font-medium">サイズ展開</h4>
            <div className="mt-1 flex gap-1">
              {["S", "M", "L", "XL"].map((size) => (
                <div
                  key={size}
                  className="flex size-8 cursor-pointer items-center justify-center rounded-md border border-border text-xs hover:bg-accent"
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-1 font-medium">商品説明</h4>
            <p className="text-muted-foreground">
              柔らかい肌触りで、カジュアルからスマートカジュアルまで幅広いシーンで活躍する一着。
              耐久性に優れた縫製を施し、洗濯による色落ちや縮みを最小限に抑えました。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
