import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TypographyLabel } from "./Typography";

interface DetailFieldCommonProps {
  label: ReactNode;
  value?: ReactNode;
  className?: string;
}

// Label / value pair for detail and profile screens
const DetailFieldCommon = ({ label, value, className }: DetailFieldCommonProps) => (
  <div className={cn("flex flex-col gap-1", className)}>
    <TypographyLabel>{label}</TypographyLabel>
    <div className="text-sm break-words text-muted-foreground">
      {value === null || value === undefined || value === "" ? "-" : value}
    </div>
  </div>
);

export default DetailFieldCommon;
