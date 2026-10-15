import type { BaseEntity } from "./api";

export interface Media extends BaseEntity {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  path: string;
  uploadedBy: string;
}
