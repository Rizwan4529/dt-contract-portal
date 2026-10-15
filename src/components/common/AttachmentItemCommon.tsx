import { Download, ExternalLink, FileImage, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatFileSize, getFileName, getFileUrl } from "@/utils/Helpers";

interface AttachmentItemCommonProps {
  // Backend file path, e.g. "/uploads/files-123-contract.pdf"
  path: string;
  name?: string;
  size?: number;
  // Edit mode (upload field) shows remove; read mode shows download
  onRemove?: () => void;
  className?: string;
}

const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|gif)$/i;

const AttachmentItemCommon = ({ path, name, size, onRemove, className }: AttachmentItemCommonProps) => {
  const fileName = name ?? getFileName(path);
  const isImage = IMAGE_EXTENSIONS.test(path);
  const Icon = isImage ? FileImage : FileText;
  const url = getFileUrl(path);

  return (
    <div className={cn("flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5", className)}>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-md",
          isImage ? "bg-info-soft text-info" : "bg-danger-soft text-danger",
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium" title={fileName}>
          {fileName}
        </span>
        {size !== undefined && <span className="text-xs text-muted-foreground">{formatFileSize(size)}</span>}
      </div>
      <Button asChild variant="ghost" size="icon-sm" aria-label={onRemove ? "Open file" : "Download file"}>
        <a href={url} target="_blank" rel="noreferrer" download={onRemove ? undefined : fileName}>
          {onRemove ? <ExternalLink /> : <Download />}
        </a>
      </Button>
      {onRemove && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Remove file"
          onClick={onRemove}
          className="hover:text-destructive"
        >
          <X />
        </Button>
      )}
    </div>
  );
};

export default AttachmentItemCommon;
