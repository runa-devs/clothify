"use client";
import { ResultCard } from "@/app/(app)/_components/result-card";
import { RecommendationCard } from "@/app/(app)/result/_components/recommendation";
import { client } from "@/lib/hono";
import { useState } from "react";

// wrapper for ssr
export const ResultContainer = ({
  beforeImage,
  afterImage,
  isPublic,
  resultId,
}: {
  beforeImage: string;
  afterImage: string;
  isPublic: boolean;
  resultId: string;
}) => {
  const [_isPublic, _setIsPublic] = useState(isPublic);
  const onTogglePublic = async () => {
    console.log("onTogglePublic", _isPublic);
    const res = await client.api.result[":id"].public.$post({
      param: {
        id: resultId,
      },
      json: {
        isPublic: !_isPublic,
      },
    });
    if (res.status === 200) {
      console.log("onTogglePublic", await res.json());
    }
    _setIsPublic(!_isPublic);
  };

  return (
    <div className="flex w-full flex-col gap-8 lg:flex-row lg:gap-12">
      <ResultCard
        beforeImage={beforeImage}
        afterImage={afterImage}
        isPublic={_isPublic}
        onTogglePublic={onTogglePublic}
      />
      <aside className="w-full lg:w-1/3">
        <RecommendationCard />
      </aside>
    </div>
  );
};
