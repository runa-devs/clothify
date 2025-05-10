import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type RecommendationItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
};

const mockRecommendations: RecommendationItem[] = [
  {
    id: "1",
    name: "カジュアルTシャツ",
    price: 2500,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop",
    rating: 4.5,
  },
  {
    id: "2",
    name: "デニムジャケット",
    price: 5800,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=300&h=300&fit=crop",
    rating: 4.2,
  },
  {
    id: "3",
    name: "スリムフィットパンツ",
    price: 4200,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=300&fit=crop",
    rating: 4.0,
  },
];

export const RecommendationCard = () => {
  return (
    <Card className=" md:ml-4 md:max-w-[350px]">
      <CardHeader>
        <CardTitle>おすすめ商品</CardTitle>
        <CardDescription>こちらもいかがですか？</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockRecommendations.map((item) => (
          <div key={item.id} className="group">
            <div className="flex items-start space-x-4">
              <div className="relative size-20 overflow-hidden rounded-md">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <div className="flex items-center space-x-1">
                  <StarIcon className="size-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-muted-foreground">{item.rating}</span>
                </div>
                <p className="mt-1 font-medium">¥{item.price.toLocaleString()}</p>
              </div>
            </div>
            <Separator className="my-3" />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Link href="/catalog" className="w-full">
          <Button variant="outline" className="w-full">
            もっと見る
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
