import { z } from "zod";
import { PAYMENT_STATUS } from "@/utils/Constants";
import { toInputDate } from "@/utils/Helpers";
import type { Contract, ContractPayload, PaymentStatus } from "@/types/contract";

// Mirrors dt-contract-apis create-contract.schema.js
export const contractSchema = z
  .object({
    title: z.string().trim().min(1, "Contract title is required"),
    vendorId: z.string().min(1, "Vendor is required"),
    departmentId: z.string().min(1, "Department is required"),
    type: z.string().min(1, "Contract type is required"),
    amount: z.number({ error: "Contract value is required" }).nonnegative("Value cannot be negative"),
    paymentStatus: z.string().min(1, "Payment status is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    duration: z.string().trim(),
    description: z.string().trim(),
    notes: z.string().trim(),
    mainDocument: z
      .string()
      .nullable()
      .refine((value) => Boolean(value), "Please attach the contract file"),
    supportingDocuments: z.array(z.string()),
  })
  .refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
    message: "End date must be on or after the start date",
    path: ["endDate"],
  });

export type ContractFormValues = z.infer<typeof contractSchema>;

// `amount` is left out so the number input starts empty
export const contractInitialValues: Partial<ContractFormValues> = {
  title: "",
  vendorId: "",
  departmentId: "",
  type: "",
  paymentStatus: PAYMENT_STATUS.PENDING,
  startDate: "",
  endDate: "",
  duration: "",
  description: "",
  notes: "",
  mainDocument: null,
  supportingDocuments: [],
};

export const toContractFormValues = (contract: Contract): ContractFormValues => ({
  title: contract.title,
  vendorId: contract.vendorId,
  departmentId: contract.departmentId,
  type: contract.type,
  amount: contract.amount,
  paymentStatus: contract.paymentStatus,
  startDate: toInputDate(contract.startDate),
  endDate: toInputDate(contract.endDate),
  duration: contract.duration ?? "",
  description: contract.description ?? "",
  notes: contract.notes ?? "",
  mainDocument: contract.attachments.mainDocument,
  supportingDocuments: contract.attachments.supportingDocuments,
});

// Backend rejects empty strings on nullable fields, so blanks become null
export const toContractPayload = (values: ContractFormValues): ContractPayload => ({
  title: values.title.trim(),
  vendorId: values.vendorId,
  departmentId: values.departmentId,
  type: values.type,
  amount: values.amount,
  paymentStatus: values.paymentStatus as PaymentStatus,
  startDate: values.startDate,
  endDate: values.endDate,
  duration: values.duration || null,
  description: values.description || null,
  notes: values.notes || null,
  attachments: values.mainDocument
    ? { mainDocument: values.mainDocument, supportingDocuments: values.supportingDocuments }
    : undefined,
});
