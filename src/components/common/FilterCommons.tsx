import { useState, type ReactNode } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SelectItem as SelectItemType } from "@/types/api";

// ------------------------------------------------------------------
//  Non react-hook-form controls used by list toolbars
// ------------------------------------------------------------------

interface SearchInputCommonProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInputCommon = ({ value, onChange, placeholder = "Search...", className }: SearchInputCommonProps) => (
  <div className={cn("relative w-full sm:max-w-sm", className)}>
    <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="pr-9 pl-10"
      aria-label={placeholder}
    />
    {value && (
      <button
        type="button"
        aria-label="Clear search"
        onClick={() => onChange("")}
        className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3 text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    )}
  </div>
);

// Radix Select cannot use "" as an item value, so "All" maps to a sentinel
const ALL_VALUE = "__all__";

interface FilterSelectCommonProps {
  value: string;
  onChange: (value: string) => void;
  items: SelectItemType[];
  placeholder: string;
  allLabel?: string;
  className?: string;
}

export const FilterSelectCommon = ({
  value,
  onChange,
  items,
  placeholder,
  allLabel,
  className,
}: FilterSelectCommonProps) => (
  <Select value={value || ALL_VALUE} onValueChange={(next) => onChange(next === ALL_VALUE ? "" : next)}>
    <SelectTrigger className={cn("h-10! w-full rounded-lg bg-card", className)} aria-label={placeholder}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value={ALL_VALUE}>{allLabel ?? `All ${placeholder}`}</SelectItem>
      {items.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

interface FilterBarCommonProps {
  // Left side: search input
  children: ReactNode;
  // Right side: filter button (FilterDrawerCommon) and any extra actions
  actions?: ReactNode;
  className?: string;
}

// Toolbar row: search on the left, filters button on the right
export const FilterBarCommon = ({ children, actions, className }: FilterBarCommonProps) => (
  <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
    <div className="flex min-w-0 flex-1 items-center gap-3">{children}</div>
    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
  </div>
);

// Label + control row inside the filter drawer
export const FilterFieldCommon = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[13px] font-medium text-foreground">{label}</span>
    {children}
  </div>
);

interface FilterDrawerCommonProps<F extends Record<string, string>> {
  // Applied filters; the drawer edits a draft copy and commits it on "Apply"
  filters: F;
  initialFilters: F;
  onApply: (filters: F) => void;
  title?: string;
  description?: string;
  children: (draft: F, setDraftValue: (key: keyof F, value: string) => void) => ReactNode;
}

// "Filters" button (right side of the toolbar) + right-side panel holding every filter except search
export const FilterDrawerCommon = <F extends Record<string, string>>({
  filters,
  initialFilters,
  onApply,
  title = "Filters",
  description = "Narrow down the list using the options below.",
  children,
}: FilterDrawerCommonProps<F>) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<F>(filters);
  const activeCount = Object.values(filters).filter(Boolean).length;

  const handleOpenChange = (next: boolean) => {
    // Start each session from the currently applied filters
    if (next) setDraft(filters);
    setOpen(next);
  };

  const setDraftValue = (key: keyof F, value: string) => setDraft((prev) => ({ ...prev, [key]: value }));

  const handleApply = () => {
    onApply(draft);
    setOpen(false);
  };

  const handleReset = () => {
    setDraft(initialFilters);
    onApply(initialFilters);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-10 w-full sm:w-auto">
          <SlidersHorizontal />
          Filters
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-sm">
        <SheetHeader className="border-b">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">{children(draft, setDraftValue)}</div>
        <SheetFooter className="flex-row border-t">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Reset
          </Button>
          <Button className="flex-1" onClick={handleApply}>
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
