import { MoveToTop } from "@/components/move-to-top";
import { CTASection } from "./_components/cta-section";
import { FeaturesSection } from "./_components/features-section";
import { Footer } from "./_components/footer";
import { Header } from "./_components/header";
import { HeroSection } from "./_components/hero-section";

export const metadata = {
  title: "Clothify - 自撮り写真だけで洋服を簡単試着",
  description: "自撮り写真をアップロードして、様々な洋服やアクセサリーをAIで試着できるアプリ",
};

export default function MarketingPage() {
  return (
    <div className="flex flex-col">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
      <MoveToTop />
    </div>
  );
}
