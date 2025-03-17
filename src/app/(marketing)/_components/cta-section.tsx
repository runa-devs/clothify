import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const CTASection = () => {
  return (
    <section className="bg-gradient-to-r from-primary to-primary/80 px-4 py-20 text-primary-foreground md:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          新しいスタイルを発見する準備はできましたか？
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80">
          今すぐ無料でClothifyを試して、あなたのファッションの可能性を広げましょう。
        </p>
        <Button
          asChild
          size="lg"
          className="gap-2 bg-background text-foreground hover:bg-background/90"
        >
          <Link href="/dashboard">
            無料で始める <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
