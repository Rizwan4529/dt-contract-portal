import { RTK_TAGS } from "@/utils/Constants";
import type { ApiResponse } from "@/types/api";

type TagType = (typeof RTK_TAGS)[keyof typeof RTK_TAGS];

// Unwrap the { success, statusCode, message, data } envelope for components.
// Toasts still read the raw message inside baseQueryWithReauth.
export const unwrapResponse = <T>(response: ApiResponse<T>) => response.data;

export const listTag = (type: TagType) => ({ type, id: "LIST" as const });

export const providesList =
  (type: TagType) =>
  <T extends { _id: string }>(result?: T[]) =>
    result ? [listTag(type), ...result.map(({ _id }) => ({ type, id: _id }))] : [listTag(type)];

export const providesItem =
  (type: TagType) =>
  (_result: unknown, _error: unknown, id: string) => [{ type, id }];

// Invalidate both the list and the touched item after update / delete
export const invalidatesItem =
  (type: TagType) =>
  (_result: unknown, _error: unknown, arg: string | { id: string }) => [
    listTag(type),
    { type, id: typeof arg === "string" ? arg : arg.id },
  ];
