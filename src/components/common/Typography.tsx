import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const TypographyH1 = ({ children, className, ...props }: ComponentProps<"h1">) => (
  <h1 className={cn("text-2xl font-semibold tracking-tight text-foreground md:text-[26px]", className)} {...props}>
    {children}
  </h1>
);

export const TypographyH2 = ({ children, className, ...props }: ComponentProps<"h2">) => (
  <h2 className={cn("text-xl font-semibold tracking-tight text-foreground", className)} {...props}>
    {children}
  </h2>
);

export const TypographyH3 = ({ children, className, ...props }: ComponentProps<"h3">) => (
  <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props}>
    {children}
  </h3>
);

export const TypographyH4 = ({ children, className, ...props }: ComponentProps<"h4">) => (
  <h4 className={cn("text-base font-semibold text-foreground", className)} {...props}>
    {children}
  </h4>
);

export const TypographyP = ({ children, className, ...props }: ComponentProps<"p">) => (
  <p className={cn("text-sm leading-6 text-foreground", className)} {...props}>
    {children}
  </p>
);

export const TypographyMuted = ({ children, className, ...props }: ComponentProps<"p">) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </p>
);

export const TypographySmall = ({ children, className, ...props }: ComponentProps<"small">) => (
  <small className={cn("text-xs font-medium text-muted-foreground", className)} {...props}>
    {children}
  </small>
);

// Field label / value pair — used on detail screens
export const TypographyLabel = ({ children, className, ...props }: ComponentProps<"p">) => (
  <p className={cn("text-xs font-semibold text-foreground", className)} {...props}>
    {children}
  </p>
);

// Serif display text — login hero, brand moments
export const TypographyDisplay = ({ children, className, ...props }: ComponentProps<"p">) => (
  <p className={cn("font-serif text-3xl leading-tight md:text-4xl", className)} {...props}>
    {children}
  </p>
);
