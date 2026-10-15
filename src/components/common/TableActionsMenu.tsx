import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Row "..." menu used in every table
export const TableActionsMenu = ({ children, label = "Row actions" }: { children: ReactNode; label?: string }) => (
  <DropdownMenu modal={false}>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={label}
        className="text-muted-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontal />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-44" onClick={(e) => e.stopPropagation()}>
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
);

interface TableActionMenuItemProps {
  icon?: LucideIcon;
  onClick: () => void;
  variant?: "default" | "destructive";
  disabled?: boolean;
  children: ReactNode;
}

export const TableActionMenuItem = ({
  icon: Icon,
  onClick,
  variant = "default",
  disabled,
  children,
}: TableActionMenuItemProps) => (
  <DropdownMenuItem variant={variant} disabled={disabled} onSelect={onClick}>
    {Icon && <Icon />}
    {children}
  </DropdownMenuItem>
);

export const TableActionMenuLink = ({ icon: Icon, to, children }: { icon?: LucideIcon; to: string; children: ReactNode }) => (
  <DropdownMenuItem asChild>
    <Link to={to}>
      {Icon && <Icon />}
      {children}
    </Link>
  </DropdownMenuItem>
);
