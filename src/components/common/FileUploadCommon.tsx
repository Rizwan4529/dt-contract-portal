import { useState } from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import type { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { ImageIcon, Loader2, UploadCloud } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUploadFilesMutation } from "@/app/features/media/mediaApi";
import { FILE_UPLOAD } from "@/utils/Constants";
import { getErrorMessage, getFileUrl } from "@/utils/Helpers";
import { FieldLabel, type BaseFieldProps } from "./FormCommons";
import AttachmentItemCommon from "./AttachmentItemCommon";

// ------------------------------------------------------------------
//  Uploads on drop via POST /media/upload and stores the returned
//  `/uploads/...` path(s) in the form:
//    multiple=false -> string | null
//    multiple=true  -> string[]
// ------------------------------------------------------------------
type FileUploadCommonProps<T extends FieldValues> = BaseFieldProps<T> & {
  multiple?: boolean;
  maxFiles?: number;
  variant?: "document" | "image";
  accept?: Accept;
  hint?: string;
};

type FileMeta = Record<string, { name: string; size: number }>;

const MAX_SIZE_BYTES = FILE_UPLOAD.MAX_SIZE_MB * 1024 * 1024;

const rejectionMessage = ({ file, errors }: FileRejection) => {
  const code = errors[0]?.code;
  if (code === "file-too-large") return `${file.name} is larger than ${FILE_UPLOAD.MAX_SIZE_MB} MB`;
  if (code === "file-invalid-type") return `${file.name} is not a supported file type`;
  if (code === "too-many-files") return "Too many files selected";
  return `${file.name} could not be added`;
};

interface FileUploadFieldProps {
  value: string | string[] | null | undefined;
  onChange: (value: string | string[] | null) => void;
  onBlur: () => void;
  multiple: boolean;
  maxFiles: number;
  variant: "document" | "image";
  accept: Accept;
  hint: string;
  disabled?: boolean;
  invalid: boolean;
}

const FileUploadField = ({
  value,
  onChange,
  onBlur,
  multiple,
  maxFiles,
  variant,
  accept,
  hint,
  disabled,
  invalid,
}: FileUploadFieldProps) => {
  const [uploadFiles, { isLoading }] = useUploadFilesMutation();
  // Original names / sizes for files uploaded in this session (backend only returns paths on the entity)
  const [meta, setMeta] = useState<FileMeta>({});

  const paths = (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean);
  const remaining = multiple ? maxFiles - paths.length : 1;
  const isImage = variant === "image";

  const handleDrop = async (accepted: File[], rejections: FileRejection[]) => {
    rejections.forEach((rejection) => toast.error(rejectionMessage(rejection)));
    if (accepted.length === 0) return;

    try {
      const uploaded = await uploadFiles(accepted).unwrap();
      setMeta((prev) => ({
        ...prev,
        ...Object.fromEntries(uploaded.map((file) => [file.path, { name: file.originalName, size: file.size }])),
      }));
      const uploadedPaths = uploaded.map((file) => file.path);
      onChange(multiple ? [...paths, ...uploadedPaths] : (uploadedPaths[0] ?? null));
      onBlur();
    } catch (error) {
      toast.error(getErrorMessage(error, "File upload failed"));
    }
  };

  const handleRemove = (path: string) => {
    onChange(multiple ? paths.filter((item) => item !== path) : null);
    onBlur();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxSize: MAX_SIZE_BYTES,
    maxFiles: multiple ? Math.max(remaining, 0) : 1,
    multiple,
    disabled: disabled || isLoading || remaining <= 0,
  });

  const dropzone = (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-input bg-card px-4 py-6 text-center transition-colors",
        "hover:border-primary/60 hover:bg-accent/40",
        isDragActive && "border-primary bg-accent/60",
        invalid && "border-destructive",
        (disabled || isLoading) && "pointer-events-none opacity-60",
        isImage && "size-28 shrink-0 px-2 py-2",
      )}
    >
      <input {...getInputProps()} />
      {isLoading ? (
        <Loader2 className="size-6 animate-spin text-primary" />
      ) : isImage ? (
        <ImageIcon className="size-6 text-muted-foreground" />
      ) : (
        <UploadCloud className="size-7 text-muted-foreground" />
      )}
      {isImage ? (
        <span className="text-xs text-muted-foreground">{isLoading ? "Uploading..." : "Upload"}</span>
      ) : (
        <>
          <p className="text-sm text-foreground">
            {isLoading ? "Uploading..." : isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-xs text-muted-foreground">or click to upload ({hint})</p>
        </>
      )}
    </div>
  );

  // Image: single square preview with change / remove
  if (isImage) {
    const path = paths[0];
    return (
      <div className="flex items-center gap-4">
        {path ? (
          <img
            src={getFileUrl(path)}
            alt=""
            className="size-28 shrink-0 rounded-lg border bg-muted object-cover"
          />
        ) : (
          dropzone
        )}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">{hint}</p>
          {path && (
            <div className="flex gap-2">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button type="button" variant="outline" size="sm" isLoading={isLoading}>
                  Change
                </Button>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => handleRemove(path)}>
                Remove
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {remaining > 0 && dropzone}
      {paths.length > 0 && (
        <ul className="flex flex-col gap-2">
          {paths.map((path) => (
            <li key={path}>
              <AttachmentItemCommon
                path={path}
                name={meta[path]?.name}
                size={meta[path]?.size}
                onRemove={() => handleRemove(path)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const FileUploadCommon = <T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  containerClassName,
  showErrorMessage = true,
  disabled,
  multiple = false,
  maxFiles = FILE_UPLOAD.MAX_FILES,
  variant = "document",
  accept,
  hint,
}: FileUploadCommonProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field, fieldState }) => (
      <FormItem className={cn("gap-1.5", containerClassName)}>
        <FieldLabel label={label} required={required} />
        <FormControl>
          <div>
            <FileUploadField
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              multiple={multiple}
              maxFiles={maxFiles}
              variant={variant}
              accept={accept ?? (variant === "image" ? FILE_UPLOAD.IMAGE_ACCEPT : FILE_UPLOAD.DOCUMENT_ACCEPT)}
              hint={hint ?? (variant === "image" ? FILE_UPLOAD.IMAGE_HINT : FILE_UPLOAD.DOCUMENT_HINT)}
              disabled={disabled}
              invalid={!!fieldState.error}
            />
          </div>
        </FormControl>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {showErrorMessage && <FormMessage className="text-xs" />}
      </FormItem>
    )}
  />
);

export default FileUploadCommon;
