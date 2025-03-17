import { Camera, ShoppingBag, Sparkles } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section id="how-it-works" className="bg-background px-4 py-20 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            簡単3ステップで新しいスタイルを発見
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Clothifyを使えば、実際に店舗に行かなくても様々な洋服を試着できます。
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-secondary p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 inline-flex rounded-full bg-chart-2/20 p-3">
              <Camera className="size-6 text-chart-2" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">写真をアップロード</h3>
            <p className="text-muted-foreground">
              自撮り写真をアップロードするだけで準備完了。特別な機材は必要ありません。
            </p>
          </div>

          <div className="rounded-lg border border-border bg-secondary p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 inline-flex rounded-full bg-chart-5/20 p-3">
              <ShoppingBag className="size-6 text-chart-5" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">洋服を選択</h3>
            <p className="text-muted-foreground">
              豊富なコレクションから気になる洋服やアクセサリーを選びましょう。
            </p>
          </div>

          <div className="rounded-lg border border-border bg-secondary p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 inline-flex rounded-full bg-chart-4/20 p-3">
              <Sparkles className="size-6 text-chart-4" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">バーチャル試着</h3>
            <p className="text-muted-foreground">
              高品質な試着結果が表示されます。気に入ったものは、購入ページからすぐに購入できます。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
