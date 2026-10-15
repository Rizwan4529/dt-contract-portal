import type { ReactNode } from "react";
import { Info, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_TONES, type StatusTone } from "@/utils/statusStyles";

interface NoticeCommonProps {
  children: ReactNode;
  tone?: StatusTone;
  icon?: LucideIcon;
  className?: string;
}

// Inline banner for page-level information (preview data, warnings)
const NoticeCommon = ({ children, tone = "info", icon: Icon = Info, className }: NoticeCommonProps) => (
  <div role="status" className={cn("flex items-start gap-2.5 rounded-lg px-4 py-3 text-sm", STATUS_TONES[tone], className)}>
    <Icon className="mt-0.5 size-4 shrink-0" />
    <div className="text-foreground/80">{children}</div>
  </div>
);

export default NoticeCommon;
