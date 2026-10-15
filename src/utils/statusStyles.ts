import {
  CONTRACT_STATUS,
  CONTRACT_STATUS_LABELS,
  PAYMENT_STATUS,
  PAYMENT_STATUS_LABELS,
  USER_STATUS,
} from "./Constants";

export const STATUS_TONES = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-neutral-soft text-neutral",
  brand: "bg-brand-soft text-brand-dark",
} as const;

export type StatusTone = keyof typeof STATUS_TONES;

export const STATUS_DOT_TONES: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  neutral: "bg-neutral",
  brand: "bg-primary",
};

export const STATUS_TONE_BY_KEY: Record<string, StatusTone> = {
  [CONTRACT_STATUS.ACTIVE]: "success",
  [CONTRACT_STATUS.EXPIRING_SOON]: "warning",
  [CONTRACT_STATUS.EXPIRED]: "danger",

  [PAYMENT_STATUS.PAID]: "success",
  [PAYMENT_STATUS.PARTIAL]: "warning",
  [PAYMENT_STATUS.PENDING]: "info",
  [PAYMENT_STATUS.OVERDUE]: "danger",

  [USER_STATUS.INACTIVE]: "neutral",
};

export const STATUS_LABEL_BY_KEY: Record<string, string> = {
  ...CONTRACT_STATUS_LABELS,
  ...PAYMENT_STATUS_LABELS,
  [USER_STATUS.INACTIVE]: "Inactive",
};

export const getStatusTone = (status?: string | null): StatusTone =>
  (status && STATUS_TONE_BY_KEY[status]) || "neutral";
