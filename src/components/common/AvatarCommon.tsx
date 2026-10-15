import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getFileUrl, getInitials } from "@/utils/Helpers";

interface AvatarCommonProps {
  name?: string | null;
  src?: string | null;
  className?: string;
  fallbackClassName?: string;
}

const AvatarCommon = ({ name, src, className, fallbackClassName }: AvatarCommonProps) => (
  <Avatar className={cn("size-9", className)}>
    {src && <AvatarImage src={getFileUrl(src)} alt={name ?? ""} />}
    <AvatarFallback className={cn("bg-brand-soft font-semibold text-brand-dark", fallbackClassName)}>
      {getInitials(name)}
    </AvatarFallback>
  </Avatar>
);

export default AvatarCommon;
