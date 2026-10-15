import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { toTitleCase } from "@/utils/Helpers";
import {
  STATUS_DOT_TONES,
  STATUS_LABEL_BY_KEY,
  STATUS_TONES,
  getStatusTone,
  type StatusTone,
} from "@/utils/statusStyles";

interface StatusBadgeProps {
  status?: string | null;
  // Override the tone resolved from `status`
  tone?: StatusTone;
  showDot?: boolean;
  className?: string;
  children?: ReactNode;
}

const StatusBadge = ({ status, tone, showDot = false, className, children }: StatusBadgeProps) => {
  const resolvedTone = tone ?? getStatusTone(status);
  const label = children ?? (status ? (STATUS_LABEL_BY_KEY[status] ?? toTitleCase(status)) : "-");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        STATUS_TONES[resolvedTone],
        className,
      )}
    >
      {showDot && <span className={cn("size-1.5 rounded-full", STATUS_DOT_TONES[resolvedTone])} />}
      {label}
    </span>
  );
};

export default StatusBadge;
