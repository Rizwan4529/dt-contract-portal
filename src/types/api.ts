// Standard envelope returned by every dt-contract-apis endpoint
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

export interface ApiValidationError {
  path: string | null;
  message: string;
  code?: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode?: number;
  message: string;
  errors?: ApiValidationError[];
}

// Mongoose document base fields
export interface BaseEntity {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

// List endpoints accept exact-match filters as query params
export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export interface SelectItem {
  value: string;
  label: string;
}
