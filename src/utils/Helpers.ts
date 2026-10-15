import { differenceInCalendarDays, format, isValid } from "date-fns";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import { APP_CONSTANTS, CONTRACT_STATUS, ENV } from "./Constants";
import type { ApiErrorResponse, QueryParams, SelectItem } from "@/types/api";
import type { ContractStatus } from "@/types/contract";

// ------------------------------------------------------------------
//  Formatting
// ------------------------------------------------------------------
export const formatDate = (value?: string | Date | null, pattern: string = APP_CONSTANTS.DATE_FORMAT) => {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  return isValid(date) ? format(date, pattern) : "-";
};

export const formatCurrency = (amount?: number | null, currency: string = APP_CONSTANTS.CURRENCY) => {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return "-";
  return `${currency} ${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
};

export const formatFileSize = (bytes?: number | null) => {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  return kb < 1024 ? `${Math.round(kb)} KB` : `${(kb / 1024).toFixed(1)} MB`;
};

export const getInitials = (name?: string | null, fallback = "U") => {
  if (!name?.trim()) return fallback;
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "")).toUpperCase();
};

// "sub_admin" -> "Sub Admin"
export const toTitleCase = (value?: string | null) =>
  (value ?? "").replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

// ------------------------------------------------------------------
//  Files
// ------------------------------------------------------------------
// Backend returns "/uploads/<file>" — resolve against the files origin
export const getFileUrl = (path?: string | null) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ENV.FILES_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
};

export const getFileName = (path?: string | null) => (path ? (path.split("/").pop() ?? path) : "");

// ------------------------------------------------------------------
//  Contracts
// ------------------------------------------------------------------
export const getDaysUntil = (date?: string | Date | null) => {
  if (!date) return null;
  const target = new Date(date);
  return isValid(target) ? differenceInCalendarDays(target, new Date()) : null;
};

export const getContractStatus = (endDate?: string | Date | null): ContractStatus => {
  const daysLeft = getDaysUntil(endDate);
  if (daysLeft === null || daysLeft < 0) return CONTRACT_STATUS.EXPIRED;
  if (daysLeft <= APP_CONSTANTS.EXPIRING_SOON_DAYS) return CONTRACT_STATUS.EXPIRING_SOON;
  return CONTRACT_STATUS.ACTIVE;
};

// ------------------------------------------------------------------
//  Data helpers
// ------------------------------------------------------------------
// Drops empty values so they never reach the backend as exact-match filters
export const buildSearchParams = (params: QueryParams = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });
  return searchParams;
};

export const withQueryString = (url: string, params?: QueryParams) => {
  const query = buildSearchParams(params).toString();
  return query ? `${url}?${query}` : url;
};

// Record<value, label> -> SelectItem[]
export const toSelectItems = (labels: Record<string, string>): SelectItem[] =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

// Backend entities -> SelectItem[]
export const entitiesToSelectItems = <T extends { _id: string; name?: string }>(list: T[] = []): SelectItem[] =>
  list.map((item) => ({ value: item._id, label: item.name ?? "" }));

export const findLabel = (items: SelectItem[], value?: string | null) =>
  items.find((item) => item.value === value)?.label ?? "-";

// Client-side search (backend list endpoints only support exact-match filters)
export const filterBySearch = <T>(list: T[], term: string, getFields: (item: T) => (string | null | undefined)[]) => {
  const query = term.trim().toLowerCase();
  if (!query) return list;
  return list.filter((item) => getFields(item).some((field) => field?.toLowerCase().includes(query)));
};

// ------------------------------------------------------------------
//  Dates
// ------------------------------------------------------------------
// Date -> "yyyy-MM-dd" (form value) and back, in local time
export const toInputDate = (value?: string | Date | null) => formatDate(value, APP_CONSTANTS.INPUT_DATE_FORMAT).replace(/^-$/, "");

export const fromInputDate = (value?: string | null) => {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return isValid(date) ? date : undefined;
};

// "2026-01-01" -> "2026-12-31" => "1 year"
export const formatDuration = (start?: string | Date | null, end?: string | Date | null) => {
  if (!start || !end) return "";
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (!isValid(startDate) || !isValid(endDate) || endDate < startDate) return "";

  // Inclusive range: 1 Jan -> 31 Dec counts as a full year
  const totalDays = differenceInCalendarDays(endDate, startDate) + 1;
  const months = Math.round(totalDays / 30.4375);
  const plural = (count: number, unit: string) => `${count} ${unit}${count === 1 ? "" : "s"}`;

  if (months >= 12 && months % 12 === 0) return plural(months / 12, "year");
  if (months >= 1) return plural(months, "month");
  return plural(totalDays, "day");
};

// ------------------------------------------------------------------
//  Errors
// ------------------------------------------------------------------
const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError =>
  typeof error === "object" && error !== null && "status" in error;

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | unknown,
  fallback = "An unexpected error occurred.",
) => {
  if (isFetchBaseQueryError(error)) {
    if (error.status === "FETCH_ERROR") return "Unable to reach the server. Please check your connection.";
    const data = error.data as ApiErrorResponse | undefined;
    // Zod validation: surface the first field error instead of the generic "Validation failed"
    const firstFieldError = data?.errors?.[0]?.message;
    return firstFieldError || data?.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
};
