import { ResultContainer } from "@/app/(app)/result/_components/resultcontainer";
import { env } from "@/env";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateDownloadUrl } from "@/lib/s3";
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
    <div className="container mx-auto flex size-full w-full flex-1 items-center justify-normal">
      <div className="mt-32 flex w-full flex-col justify-center gap-4 p-3 md:mt-0 md:flex-row">
        <ResultContainer
          beforeImage={sourceUrl}
          afterImage={resultUrl}
          isPublic={result.isPublic}
          resultId={id}
        />
      </div>
    </div>
  );
}
