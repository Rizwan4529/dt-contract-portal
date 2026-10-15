import type { BaseEntity } from "./api";

// Departments and vendors share the exact same shape on the backend
export interface LookupEntity extends BaseEntity {
  name: string;
  description: string | null;
  image: string | null;
}

export type Department = LookupEntity;
export type Vendor = LookupEntity;

export interface LookupPayload {
  name: string;
  description: string | null;
  image: string | null;
}

export type UpdateLookupPayload = Partial<LookupPayload> & { id: string };
