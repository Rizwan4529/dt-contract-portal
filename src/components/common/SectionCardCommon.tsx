import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TypographyH4 } from "./Typography";

interface SectionCardCommonProps {
  title?: ReactNode;
  // Right side of the header: "View All", buttons, etc.
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

// White surface card used for every content block (tables, details, forms)
const SectionCardCommon = ({ title, action, className, contentClassName, children }: SectionCardCommonProps) => (
  <section className={cn("rounded-xl border bg-card text-card-foreground shadow-card", className)}>
    {(title || action) && (
      <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
        {title && <TypographyH4>{title}</TypographyH4>}
        {action}
      </header>
    )}
    <div className={cn("px-5 pb-5", !(title || action) && "pt-5", contentClassName)}>{children}</div>
  </section>
);

export default SectionCardCommon;
