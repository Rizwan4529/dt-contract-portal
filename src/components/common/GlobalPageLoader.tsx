import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandLogo";

// `compact` fills the content area only (inside layouts), otherwise full screen
const GlobalPageLoader = ({ compact = false }: { compact?: boolean }) => (
  <div
    role="status"
    aria-label="Loading"
    className={cn("flex w-full items-center justify-center bg-background", compact ? "h-full min-h-60" : "h-svh")}
  >
    <BrandMark className="brand-pulse size-14" />
  </div>
);

export default GlobalPageLoader;
