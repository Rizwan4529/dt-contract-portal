import { CONTRACT_STATUS, CONTRACT_TYPE_LABELS, PAYMENT_STATUS } from "@/utils/Constants";
import { getContractStatus, getDaysUntil, toTitleCase } from "@/utils/Helpers";
import type { Contract, ContractStatus, PaymentStatus } from "@/types/contract";

// Contract + resolved names + derived status: what every contract screen renders
export interface ContractRow extends Contract {
  vendorName: string;
  departmentName: string;
  status: ContractStatus;
  daysLeft: number | null;
}

export interface ContractNameResolvers {
  getVendorName: (id?: string | null) => string;
  getDepartmentName: (id?: string | null) => string;
}

export const toContractRow = (contract: Contract, resolvers: ContractNameResolvers): ContractRow => ({
  ...contract,
  vendorName: resolvers.getVendorName(contract.vendorId),
  departmentName: resolvers.getDepartmentName(contract.departmentId),
  status: getContractStatus(contract.endDate),
  daysLeft: getDaysUntil(contract.endDate),
});

// Backend stores type as free text; known keys get a friendly label
export const getContractTypeLabel = (type?: string | null) =>
  type ? (CONTRACT_TYPE_LABELS[type] ?? toTitleCase(type)) : "-";

export interface BreakdownItem {
  key: string;
  label: string;
  value: number;
}

const countBy = (rows: ContractRow[], getKey: (row: ContractRow) => string, getLabel: (row: ContractRow) => string) => {
  const map = new Map<string, BreakdownItem>();
  rows.forEach((row) => {
    const key = getKey(row);
    const item = map.get(key) ?? { key, label: getLabel(row), value: 0 };
    item.value += 1;
    map.set(key, item);
  });
  return [...map.values()].sort((a, b) => b.value - a.value);
};

// Everything the dashboard needs, derived client-side (backend has no stats endpoint)
export const getContractStats = (rows: ContractRow[]) => {
  const countStatus = (status: ContractStatus) => rows.filter((row) => row.status === status).length;
  const paymentCounts = Object.values(PAYMENT_STATUS).map((status) => ({
    key: status,
    label: status,
    value: rows.filter((row) => row.paymentStatus === (status as PaymentStatus)).length,
  }));

  return {
    total: rows.length,
    active: countStatus(CONTRACT_STATUS.ACTIVE),
    expiringSoon: countStatus(CONTRACT_STATUS.EXPIRING_SOON),
    expired: countStatus(CONTRACT_STATUS.EXPIRED),
    totalValue: rows.reduce((sum, row) => sum + (row.amount || 0), 0),
    byPaymentStatus: paymentCounts,
    byDepartment: countBy(rows, (row) => row.departmentId, (row) => row.departmentName),
    byVendor: countBy(rows, (row) => row.vendorId, (row) => row.vendorName),
    recent: [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    expiringNext: rows
      .filter((row) => row.status === CONTRACT_STATUS.EXPIRING_SOON)
      .sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0))
      .slice(0, 5),
  };
};
