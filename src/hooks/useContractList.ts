import { toContractRow, type ContractRow } from "@/components/contracts/contractView";
import { MOCK_CONTRACTS, MOCK_DEPARTMENTS, MOCK_VENDORS } from "@/mocks/contractsMock";
import { CONTRACT_TYPE_LABELS } from "@/utils/Constants";
import { entitiesToSelectItems, filterBySearch } from "@/utils/Helpers";
import { useListFilters } from "./useListFilters";

// ------------------------------------------------------------------
//  UI PREVIEW: reads mock data until the contracts API is integrated.
//  Integration = swap the source below for
//    useGetContractsQuery({ departmentId, vendorId, type, paymentStatus })
//  + useLookupOptions() for names. The return shape stays the same.
// ------------------------------------------------------------------
const departmentMap = new Map(MOCK_DEPARTMENTS.map((item) => [item._id, item.name]));
const vendorMap = new Map(MOCK_VENDORS.map((item) => [item._id, item.name]));

const resolvers = {
  getDepartmentName: (id?: string | null) => (id ? (departmentMap.get(id) ?? "-") : "-"),
  getVendorName: (id?: string | null) => (id ? (vendorMap.get(id) ?? "-") : "-"),
};

const ALL_ROWS: ContractRow[] = MOCK_CONTRACTS.map((contract) => toContractRow(contract, resolvers));

export const CONTRACT_FILTERS = { departmentId: "", vendorId: "", type: "", paymentStatus: "", status: "" };

export function useContractList() {
  const list = useListFilters(CONTRACT_FILTERS);
  const { departmentId, vendorId, type, paymentStatus, status } = list.filters;

  // Exact-match filters map 1:1 to backend query params; `status` is derived client-side
  const filtered = ALL_ROWS.filter(
    (row) =>
      (!departmentId || row.departmentId === departmentId) &&
      (!vendorId || row.vendorId === vendorId) &&
      (!type || row.type === type) &&
      (!paymentStatus || row.paymentStatus === paymentStatus) &&
      (!status || row.status === status),
  );

  const contracts = filterBySearch(filtered, list.debouncedSearch, (row) => [
    row.title,
    row.vendorName,
    row.departmentName,
    row.description,
  ]);

  return {
    ...list,
    contracts,
    allContracts: ALL_ROWS,
    departmentItems: entitiesToSelectItems(MOCK_DEPARTMENTS),
    vendorItems: entitiesToSelectItems(MOCK_VENDORS),
    typeItems: Object.entries(CONTRACT_TYPE_LABELS).map(([value, label]) => ({ value, label })),
    isLoading: false,
    isPreview: true,
  };
}

export const findPreviewContract = (id?: string) => ALL_ROWS.find((row) => row._id === id) ?? null;
