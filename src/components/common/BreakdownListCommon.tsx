import { cn } from "@/lib/utils";
import { STATUS_DOT_TONES, type StatusTone } from "@/utils/statusStyles";
import { TypographyMuted } from "./Typography";

export interface BreakdownListItem {
  key: string;
  label: string;
  value: number;
  tone?: StatusTone;
}

interface BreakdownListCommonProps {
  items: BreakdownListItem[];
  // Bars are relative to this total (defaults to the sum of values)
  total?: number;
  emptyMessage?: string;
  className?: string;
}

// Horizontal bar list: label, count, share of total
const BreakdownListCommon = ({ items, total, emptyMessage = "No data yet", className }: BreakdownListCommonProps) => {
  const sum = total ?? items.reduce((acc, item) => acc + item.value, 0);

  if (items.length === 0 || sum === 0) return <TypographyMuted>{emptyMessage}</TypographyMuted>;

  return (
    <ul className={cn("flex flex-col gap-3.5", className)}>
      {items.map((item) => {
        const percent = Math.round((item.value / sum) * 100);
        return (
          <li key={item.key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate">{item.label}</span>
              <span className="shrink-0 text-muted-foreground">
                <span className="font-semibold text-foreground">{item.value}</span> &middot; {percent}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", STATUS_DOT_TONES[item.tone ?? "brand"])}
                style={{ width: `${percent}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default BreakdownListCommon;
