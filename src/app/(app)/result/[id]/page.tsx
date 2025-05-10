import { env } from "@/env";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateDownloadUrl } from "@/lib/s3";
import Image from "next/image";
import { notFound } from "next/navigation";
interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const session = await auth();

  const { id } = await params;

  const result = await prisma.tryOnResult.findUnique({
    where: {
      id,
      OR: [{ isPublic: true }, { userId: session?.user.id }],
    },
    include: {
      item: true,
    },
  });

  // redirect if:
  // 1. result not found
  // 2. result is not public
  if (!result) {
    return notFound();
  }

  const resultUrl = await generateDownloadUrl({
    bucket: env.S3_BUCKET,
    key: result.resultKey,
    expiresIn: 3600,
  });
  const sourceUrl = await generateDownloadUrl({
    bucket: env.S3_BUCKET,
    key: result.sourceKey,
    expiresIn: 3600,
  });

  return (
    <div>
      <Image src={resultUrl} alt="Result" width={500} height={500} />
      <Image src={sourceUrl} alt="Source" width={500} height={500} />
    </div>
  );
}
