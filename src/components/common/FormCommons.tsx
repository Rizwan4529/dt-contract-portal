import { useState, type ChangeEvent, type ComponentProps, type ReactNode } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import { CalendarDays, type LucideIcon } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input, InputPassword } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { APP_CONSTANTS } from "@/utils/Constants";
import { formatDate, fromInputDate, toInputDate } from "@/utils/Helpers";
import type { SelectItem as SelectItemType } from "@/types/api";

// ------------------------------------------------------------------
//  Shared props for every react-hook-form field wrapper.
//  All fields must be rendered inside <Form {...form}>.
// ------------------------------------------------------------------
export interface BaseFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: ReactNode;
  required?: boolean;
  description?: ReactNode;
  className?: string;
  containerClassName?: string;
  showErrorMessage?: boolean;
  disabled?: boolean;
}

export const FieldLabel = ({ label, required }: { label?: ReactNode; required?: boolean }) =>
  label ? (
    <FormLabel className="text-[13px] font-medium text-foreground">
      {label}
      {required && <span className="-ml-1 text-destructive">*</span>}
    </FormLabel>
  ) : null;

// ------------------------------------------------------------------
//  Input (text / email / number / password) with optional left icon
// ------------------------------------------------------------------
type InputCommonProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<ComponentProps<"input">, "name" | "className"> & {
    inputType?: ComponentProps<"input">["type"];
    icon?: LucideIcon;
  };

export const InputCommon = <T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  className,
  containerClassName,
  showErrorMessage = true,
  disabled,
  inputType = "text",
  icon: Icon,
  ...props
}: InputCommonProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => {
      // id / aria-* are injected by <FormControl> so labels and errors stay linked
      const inputProps = {
        disabled,
        className: cn(Icon && "pl-10", className),
        ...props,
        ...field,
        // keep number inputs as numbers in form state
        value: field.value ?? "",
        onChange: (e: ChangeEvent<HTMLInputElement>) =>
          field.onChange(inputType === "number" && e.target.value !== "" ? e.target.valueAsNumber : e.target.value),
      };

      return (
        <FormItem className={cn("gap-1.5", containerClassName)}>
          <FieldLabel label={label} required={required} />
          <div className="relative">
            {Icon && (
              <Icon className="pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
            )}
            <FormControl>
              {inputType === "password" ? <InputPassword {...inputProps} /> : <Input type={inputType} {...inputProps} />}
            </FormControl>
          </div>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
          {showErrorMessage && <FormMessage className="text-xs" />}
        </FormItem>
      );
    }}
  />
);

// ------------------------------------------------------------------
//  Textarea
// ------------------------------------------------------------------
type TextAreaCommonProps<T extends FieldValues> = BaseFieldProps<T> &
  Omit<ComponentProps<"textarea">, "name" | "className">;

export const TextAreaCommon = <T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  className,
  containerClassName,
  showErrorMessage = true,
  disabled,
  ...props
}: TextAreaCommonProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={cn("gap-1.5", containerClassName)}>
        <FieldLabel label={label} required={required} />
        <FormControl>
          <Textarea
            disabled={disabled}
            className={cn("min-h-24 resize-none rounded-lg bg-card", className)}
            {...props}
            {...field}
            value={field.value ?? ""}
          />
        </FormControl>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {showErrorMessage && <FormMessage className="text-xs" />}
      </FormItem>
    )}
  />
);

// ------------------------------------------------------------------
//  Select — items: [{ value, label }]
// ------------------------------------------------------------------
type SelectCommonProps<T extends FieldValues> = BaseFieldProps<T> & {
  items: SelectItemType[];
  placeholder?: string;
  isLoading?: boolean;
  onValueChange?: (value: string) => void;
};

export const SelectCommon = <T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  className,
  containerClassName,
  showErrorMessage = true,
  disabled,
  items = [],
  placeholder = "Select",
  isLoading = false,
  onValueChange,
}: SelectCommonProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={cn("gap-1.5", containerClassName)}>
        <FieldLabel label={label} required={required} />
        <Select
          value={field.value ?? ""}
          disabled={disabled || isLoading}
          onValueChange={(value) => {
            field.onChange(value);
            onValueChange?.(value);
          }}
        >
          <FormControl>
            <SelectTrigger className={cn("h-10! w-full rounded-lg bg-card", className)}
            >
              <SelectValue placeholder={isLoading ? "Loading..." : placeholder} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {items.length === 0 ? (
              <div className="px-2 py-3 text-center text-sm text-muted-foreground">No options</div>
            ) : (
              items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {showErrorMessage && <FormMessage className="text-xs" />}
      </FormItem>
    )}
  />
);

// ------------------------------------------------------------------
//  Date picker — form value is a "yyyy-MM-dd" string
// ------------------------------------------------------------------
type DatePickerCommonProps<T extends FieldValues> = BaseFieldProps<T> & {
  placeholder?: string;
  // Disable dates before this "yyyy-MM-dd" value (e.g. end date >= start date)
  minDate?: string;
};

const YEARS_RANGE = 15;

export const DatePickerCommon = <T extends FieldValues>({
  control,
  name,
  label,
  required,
  description,
  className,
  containerClassName,
  showErrorMessage = true,
  disabled,
  placeholder = APP_CONSTANTS.DISPLAY_INPUT_DATE_FORMAT.toLowerCase(),
  minDate,
}: DatePickerCommonProps<T>) => {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const min = fromInputDate(minDate);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected = fromInputDate(field.value);
        return (
          <FormItem className={cn("gap-1.5", containerClassName)}>
            <FieldLabel label={label} required={required} />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "h-10 w-full justify-between rounded-lg px-3 font-normal",
                      !selected && "text-muted-foreground/70",
                      className,
                    )}
                  >
                    {selected ? formatDate(selected, APP_CONSTANTS.DISPLAY_INPUT_DATE_FORMAT) : placeholder}
                    <CalendarDays className="text-muted-foreground" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-3" align="start">
                <DayPicker
                  mode="single"
                  captionLayout="dropdown"
                  selected={selected}
                  defaultMonth={selected ?? min}
                  startMonth={new Date(today.getFullYear() - YEARS_RANGE, 0)}
                  endMonth={new Date(today.getFullYear() + YEARS_RANGE, 11)}
                  disabled={min ? { before: min } : undefined}
                  onSelect={(date) => {
                    field.onChange(date ? toInputDate(date) : "");
                    field.onBlur();
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
            {showErrorMessage && <FormMessage className="text-xs" />}
          </FormItem>
        );
      }}
    />
  );
};

// ------------------------------------------------------------------
//  One-time code (OTP)
// ------------------------------------------------------------------
type OtpInputCommonProps<T extends FieldValues> = BaseFieldProps<T> & { length?: number };

export const OtpInputCommon = <T extends FieldValues>({
  control,
  name,
  label,
  required,
  containerClassName,
  showErrorMessage = true,
  disabled,
  length = APP_CONSTANTS.OTP_LENGTH,
}: OtpInputCommonProps<T>) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={cn("items-center gap-2", containerClassName)}>
        <FieldLabel label={label} required={required} />
        <FormControl>
          <InputOTP maxLength={length} disabled={disabled} {...field}>
            <InputOTPGroup>
              {Array.from({ length }).map((_, index) => (
                <InputOTPSlot key={index} index={index} className="size-11 bg-card text-base" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </FormControl>
        {showErrorMessage && <FormMessage className="text-xs" />}
      </FormItem>
    )}
  />
);

// ------------------------------------------------------------------
//  Submit / cancel row shared by every form
// ------------------------------------------------------------------
interface FormActionsCommonProps {
  submitLabel: string;
  isLoading?: boolean;
  onCancel?: () => void;
  cancelLabel?: string;
  // "end" for dialogs, "start" for full-page forms
  align?: "start" | "end";
  className?: string;
}

export const FormActionsCommon = ({
  submitLabel,
  isLoading = false,
  onCancel,
  cancelLabel = "Cancel",
  align = "end",
  className,
}: FormActionsCommonProps) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 pt-2 sm:flex-row",
      align === "end" ? "sm:justify-end" : "sm:justify-start",
      className,
    )}
  >
    {onCancel && (
      <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
        {cancelLabel}
      </Button>
    )}
    <Button type="submit" isLoading={isLoading}>
      {submitLabel}
    </Button>
  </div>
);
