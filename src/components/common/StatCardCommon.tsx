import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { STATUS_TONES, type StatusTone } from "@/utils/statusStyles";

interface StatCardCommonProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: StatusTone;
  hint?: string;
  isLoading?: boolean;
  className?: string;
}

// Dashboard KPI tile: tinted icon, big number, label
const StatCardCommon = ({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  hint,
  isLoading = false,
  className,
}: StatCardCommonProps) => (
  <div className={cn("flex flex-col gap-4 rounded-xl border bg-card p-5 shadow-card", className)}>
    <span className={cn("flex size-10 items-center justify-center rounded-lg", STATUS_TONES[tone])}>
      <Icon className="size-5" />
    </span>
    <div className="flex flex-col gap-0.5">
      {isLoading ? (
        <Skeleton className="h-8 w-14" />
      ) : (
        <span className="text-[28px] leading-none font-semibold tracking-tight">{value}</span>
      )}
      <span className="mt-1 text-sm text-muted-foreground">{label}</span>
      {hint && <span className="text-xs text-muted-foreground/80">{hint}</span>}
    </div>
  </div>
);

export default StatCardCommon;
