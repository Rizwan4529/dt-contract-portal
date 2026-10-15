import { cn } from "@/lib/utils";
import { APP_CONSTANTS } from "@/utils/Constants";

interface BrandLogoProps {
  // "light" = on dark backgrounds (sidebar), "dark" = on light backgrounds (login)
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const MARK_SIZES = { sm: "size-9", md: "size-11", lg: "size-14" };
const TEXT_SIZES = { sm: "text-sm", md: "text-base", lg: "text-xl" };

// Monogram placeholder. Swap the <svg> for the official hotel logo when it is provided.
export const BrandMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={cn("shrink-0 text-primary", className)} aria-hidden="true">
    <circle cx="24" cy="24" r="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="24" cy="24" r="18.5" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.6" />
    <path d="M15 15.5h18v3.2h-7.3V34h-3.4V18.7H15z" fill="currentColor" />
  </svg>
);

const BrandLogo = ({ variant = "dark", size = "md", showText = true, className }: BrandLogoProps) => (
  <div className={cn("flex items-center gap-3", className)}>
    <BrandMark className={MARK_SIZES[size]} />
    {showText && (
      <div className="flex min-w-0 flex-col leading-tight">
        <span
          className={cn(
            "truncate font-serif font-semibold",
            TEXT_SIZES[size],
            variant === "light" ? "text-sidebar-primary-foreground" : "text-brand-dark",
          )}
        >
          {APP_CONSTANTS.APP_NAME}
        </span>
        <span className="flex items-center gap-2 text-[11px] text-primary">
          <span dir="rtl" lang="ar">
            {APP_CONSTANTS.APP_NAME_AR}
          </span>
          <span className="opacity-60">|</span>
          <span>{APP_CONSTANTS.APP_LOCATION}</span>
        </span>
      </div>
    )}
  </div>
);

export default BrandLogo;
