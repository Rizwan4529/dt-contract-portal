import { useGetDepartmentsQuery } from "@/app/features/departments/departmentsApi";
import { useGetVendorsQuery } from "@/app/features/vendors/vendorsApi";
import { entitiesToSelectItems } from "@/utils/Helpers";
import type { LookupEntity } from "@/types/lookup";

const toNameMap = (list: LookupEntity[] = []) => new Map(list.map((item) => [item._id, item.name]));

// Departments / vendors as select options + id -> name resolvers.
// Backend never populates references, so every screen resolves names through this hook.
export function useLookupOptions({ departments = true, vendors = true } = {}) {
  const departmentsQuery = useGetDepartmentsQuery(undefined, { skip: !departments });
  const vendorsQuery = useGetVendorsQuery(undefined, { skip: !vendors });

  const departmentMap = toNameMap(departmentsQuery.data);
  const vendorMap = toNameMap(vendorsQuery.data);

  return {
    departments: departmentsQuery.data ?? [],
    vendors: vendorsQuery.data ?? [],
    departmentItems: entitiesToSelectItems(departmentsQuery.data),
    vendorItems: entitiesToSelectItems(vendorsQuery.data),
    getDepartmentName: (id?: string | null) => (id ? (departmentMap.get(id) ?? "-") : "-"),
    getVendorName: (id?: string | null) => (id ? (vendorMap.get(id) ?? "-") : "-"),
    isLoading: departmentsQuery.isLoading || vendorsQuery.isLoading,
  };
}
