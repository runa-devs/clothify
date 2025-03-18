"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  step: number;
  totalSteps?: number;
  className?: string;
}

export const ProgressBar = ({ step, totalSteps = 3, className }: ProgressBarProps) => {
  return (
    <div className={cn("mx-auto flex max-w-md items-center gap-4", className)}>
      <Progress value={((step - 1) / (totalSteps - 1)) * 100} className="w-full" />
      <span className="whitespace-nowrap text-sm text-muted-foreground">
        Step {step}/{totalSteps}
      </span>
    </div>
  );
};
