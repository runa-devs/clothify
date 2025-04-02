import { ProductDetailCard } from "./product-detail-card";
import { RelatedProductsCard } from "./related-products-card";

interface ResultPanelProps {
  isMobile: boolean;
}

export const ResultPanel = ({ isMobile }: ResultPanelProps) => {
  if (isMobile) return null;

  return (
    <div className="space-y-6">
      <ProductDetailCard />
      <RelatedProductsCard />
    </div>
  );
};
