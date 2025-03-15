import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Clothify - AIで洋服を簡単試着",
  description: "自撮り写真をアップロードして、様々な洋服やアクセサリーをAIで試着できるアプリ",
};

export default function MarketingPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <Image
          src="/logo.svg"
          alt="Clothify Logo"
          width={120}
          height={120}
          className="mb-8 dark:invert"
        />

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          <span className="block text-primary">Clothify</span>
          <span className="mt-2 block text-2xl sm:text-3xl">AIを活用した新しい試着体験</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          自撮り写真をアップロードするだけで、様々な洋服やアクセサリーを手軽に試着できます。
          買い物前に自分に似合うかどうかを確認して、より賢いショッピング体験を。
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/try-on">
            <Button size="lg" className="group w-full sm:w-auto">
              今すぐ試す
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              詳細を見る
            </Button>
          </Link>
        </div>
      </div>

      <div id="features" className="mx-auto mt-24 max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-bold">主な機能</h2>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-xl font-semibold">簡単試着</h3>
            <p className="text-muted-foreground">
              自撮り写真をアップロードするだけで、様々な洋服を試着できます
            </p>
          </div>

          <div className="rounded-lg bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-xl font-semibold">豊富なカタログ</h3>
            <p className="text-muted-foreground">
              多数のブランドやスタイルから選べる豊富な洋服カタログ
            </p>
          </div>

          <div className="rounded-lg bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-xl font-semibold">スタイル提案</h3>
            <p className="text-muted-foreground">
              あなたに合ったスタイルを提案し、ショッピング体験をサポート
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
