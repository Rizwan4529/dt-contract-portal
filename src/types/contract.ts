import type { CONTRACT_STATUS, PAYMENT_STATUS } from "@/utils/Constants";
import type { BaseEntity } from "./api";

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
// Derived on the client from endDate — the backend has no status field
export type ContractStatus = (typeof CONTRACT_STATUS)[keyof typeof CONTRACT_STATUS];

export interface ContractAttachments {
  mainDocument: string | null;
  supportingDocuments: string[];
}

export interface Contract extends BaseEntity {
  vendorId: string;
  departmentId: string;
  createdBy: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  duration: string | null;
  type: string;
  amount: number;
  paymentStatus: PaymentStatus;
  notes: string | null;
  attachments: ContractAttachments;
}

export interface ContractPayload {
  vendorId: string;
  departmentId: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  duration?: string | null;
  type: string;
  amount: number;
  paymentStatus?: PaymentStatus;
  notes?: string | null;
  attachments?: {
    mainDocument: string;
    supportingDocuments?: string[];
  };
}

export type UpdateContractPayload = Partial<ContractPayload> & { id: string };
