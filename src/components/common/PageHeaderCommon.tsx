import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { TypographyH1, TypographyMuted } from "./Typography";

interface PageHeaderCommonProps {
  title: ReactNode;
  description?: ReactNode;
  // Right side primary action buttons
  actions?: ReactNode;
  backTo?: { label: string; path: string };
  className?: string;
}

const PageHeaderCommon = ({ title, description, actions, backTo, className }: PageHeaderCommonProps) => (
  <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
    <div className="flex min-w-0 flex-col gap-1">
      <TypographyH1>{title}</TypographyH1>
      {backTo && (
        <Link
          to={backTo.path}
          className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-3.5" />
          {backTo.label}
        </Link>
      )}
      {description && <TypographyMuted>{description}</TypographyMuted>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeaderCommon;
