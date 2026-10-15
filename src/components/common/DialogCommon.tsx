import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DialogCommonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headerTitle: ReactNode;
  headerDescription?: ReactNode;
  className?: string;
  children: ReactNode;
}

const DialogCommon = ({
  open,
  onOpenChange,
  headerTitle,
  headerDescription,
  className,
  children,
}: DialogCommonProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className={cn("max-h-[90vh] overflow-y-auto sm:max-w-lg", className)}>
      <DialogHeader>
        <DialogTitle>{headerTitle}</DialogTitle>
        <DialogDescription className={cn(!headerDescription && "sr-only")}>
          {headerDescription ?? headerTitle}
        </DialogDescription>
      </DialogHeader>
      {children}
    </DialogContent>
  </Dialog>
);

export default DialogCommon;
