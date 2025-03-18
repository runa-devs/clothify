import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const HeroSection = () => {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background to-secondary px-4 py-24 pt-32 md:px-6 lg:px-8">
      <div className="bg-grid-slate-200 dark:bg-grid-slate-800 absolute inset-0 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      <div className="container relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
        <div className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-foreground shadow-sm">
          <span className="flex size-2 rounded-full bg-chart-5"></span>
          <span className="ml-2">New - バーチャル試着体験</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          自撮り写真だけで
          <br />
          <span className="bg-gradient-to-r from-chart-5 to-chart-1 bg-clip-text text-transparent">
            新しい自分に出会える
          </span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
          自撮り写真をアップロードするだけで、様々な洋服やアクセサリーを試着できます。
          お気に入りの一着を見つけて、あなたのスタイルを一新しましょう。
        </p>
        <div className="relative flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 bg-primary hover:bg-primary/90">
            <Link href="/try-on">
              今すぐ試す <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="#how-it-works">詳しく見る</Link>
          </Button>
        </div>
      </div>

      {/* virtual try-on preview */}
      <div className="relative mt-12 w-full max-w-4xl">
        <div className="absolute -right-4 -top-4 z-50 rounded-full bg-chart-5/20 p-2 shadow-md">
          <Sparkles className="size-6 text-chart-5" />
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <div className="aspect-video w-full bg-gradient-to-r from-chart-2/10 to-chart-4/10 p-4">
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <Sparkles className="mx-auto size-12 text-chart-2" />
                <p className="mt-4 text-lg font-medium text-card-foreground">バーチャル試着体験</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
