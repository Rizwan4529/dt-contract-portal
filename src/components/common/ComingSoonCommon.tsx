import { Construction } from "lucide-react";
import { TypographyMuted } from "./Typography";
import SectionCardCommon from "./SectionCardCommon";

// Temporary placeholder body for pages that are scaffolded but not built yet
const ComingSoonCommon = ({ message = "This module will be built in the next phase." }: { message?: string }) => (
  <SectionCardCommon contentClassName="flex flex-col items-center justify-center gap-3 py-16 text-center">
    <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-primary">
      <Construction className="size-5" />
    </span>
    <TypographyMuted>{message}</TypographyMuted>
  </SectionCardCommon>
);

export default ComingSoonCommon;
