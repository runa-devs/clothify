import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env/server";
import { prisma } from "@/lib/prisma";
import { generateDownloadUrl } from "@/lib/s3";
import { Globe, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface FittingItem {
  name: string;
  brand: string;
  category: string;
}

interface FittingHistoryEntry {
  id: string;
  date: string;
  imageUrl: string;
  items: FittingItem[];
  description: string;
  link: string;
  isPublic: boolean;
}

async function getCurrentUser() {
  const user = await prisma.user.findFirst();
  if (!user) {
    notFound();
  }
  return {
    ...user,
    username: user?.email?.split("@")[0] || "user",
    bio: "ファッション愛好家！",
  };
}

export default async function ProfilePage() {
  const user = await getCurrentUser();

  let tryOnData: FittingHistoryEntry[] = [];

  if (user && user.id !== "clxko9y78000008l8c3goh5b7") {
    const tryOnResults = await prisma.tryOnResult.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        item: true,
      },
    });

    tryOnData = await Promise.all(
      tryOnResults.map(async (result) => {
        const item = result.item;
        const itemDetails: FittingItem = item
          ? {
              name: item.name,
              brand: item.brandJp || "Brandless",
              category: "General",
            }
          : { name: "Unknown Item", brand: "N/A", category: "Unknown" };

        return {
          id: result.id,
          date: result.createdAt.toISOString().split("T")[0],
          imageUrl: await generateDownloadUrl({
            bucket: env.S3_BUCKET,
            key: result.resultKey,
            expiresIn: 3600,
          }),
          items: [itemDetails],
          description: `Tried on: ${itemDetails.name}. Public: ${result.isPublic ? "Yes" : "No"}`,
          link: `/result/${result.shareId}`,
          isPublic: result.isPublic,
        };
      })
    );
  }

  return (
    <div className="container mx-auto mt-12 max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-12">
        <div className="flex flex-col items-center sm:flex-row sm:items-start">
          <Avatar className="size-24 border-4 border-primary/20 shadow-lg sm:size-32">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="mt-4 text-center sm:ml-6 sm:mt-0 sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {user.name || "User Name"}
            </h1>
            <p className="text-muted-foreground">@{user.username || "username"}</p>
            <p className="mt-2 max-w-md text-sm text-foreground/80">
              {user.bio || "User biography."}
            </p>
            {user.id !== user.id && (
              <Button variant="outline" size="sm" className="mt-4">
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </header>

      <Separator className="my-8" />

      <section>
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">過去の試着</h2>
        {tryOnData.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {tryOnData.map((result, index) => (
              <Card
                key={result.id}
                className="group flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl dark:bg-slate-800"
              >
                <CardHeader className="relative aspect-[3/4] p-0 sm:aspect-[4/3]">
                  <Image
                    src={result.imageUrl}
                    alt={`Fitting on ${new Date(result.date).toLocaleDateString()}`}
                    className="absolute inset-0 size-full rounded-t-lg object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 3}
                  />
                  <div className="absolute bottom-2 right-2 z-10">
                    {result.isPublic ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
                      >
                        <Globe className="mr-1 size-3" /> 公開
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-amber-500 bg-amber-50 text-amber-700 dark:border-amber-600 dark:bg-amber-700 dark:text-amber-100"
                      >
                        <Lock className="mr-1 size-3" /> 非公開
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex grow flex-col p-4 sm:p-5">
                  {result.items.map((item: FittingItem) => (
                    <div key={item.name} className="mb-2">
                      {" "}
                      <CardTitle className="mb-0.5 text-xl font-semibold leading-tight text-foreground dark:text-slate-100">
                        {" "}
                        {item.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground dark:text-slate-400">
                        {item.brand} / {item.category}
                      </p>
                    </div>
                  ))}
                  <p className="mt-1 text-xs text-muted-foreground dark:text-slate-500">
                    {" "}
                    試着日:{" "}
                    {new Date(result.date).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                </CardContent>
                <CardFooter className="mt-auto border-t p-4 dark:border-slate-700">
                  <Button
                    asChild
                    variant="default"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                  >
                    <Link href={result.link}>詳細を見る</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="text-lg text-muted-foreground">
              {user.id === "clxko9y78000008l8c3goh5b7"
                ? "Log in to see your fitting history."
                : "No fitting history yet."}
            </p>
            {user.id !== "clxko9y78000008l8c3goh5b7" && (
              <Button asChild className="mt-4">
                <Link href="/try-on">Start a New Fitting</Link>
              </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
