import type { ReactNode } from "react";
import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TypographyH4, TypographyMuted } from "./Typography";

interface EmptyStateCommonProps {
  icon?: LucideIcon;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const EmptyStateCommon = ({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  action,
  className,
}: EmptyStateCommonProps) => (
  <div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-14 text-center", className)}>
    <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-primary">
      <Icon className="size-5" />
    </span>
    <div className="flex flex-col gap-1">
      <TypographyH4>{title}</TypographyH4>
      {description && <TypographyMuted className="max-w-sm">{description}</TypographyMuted>}
    </div>
    {action}
  </div>
);

export default EmptyStateCommon;
