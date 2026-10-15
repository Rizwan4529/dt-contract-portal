import { Building2, Handshake, type LucideIcon } from "lucide-react";
import {
  useAddDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
  useUpdateDepartmentMutation,
} from "@/app/features/departments/departmentsApi";
import {
  useAddVendorMutation,
  useDeleteVendorMutation,
  useGetVendorsQuery,
  useUpdateVendorMutation,
} from "@/app/features/vendors/vendorsApi";
import { PERMISSIONS } from "@/utils/Constants";
import type { Permission } from "@/utils/permissions";

// Departments and vendors are identical on the backend ({ name, description, image }),
// so one module renders both from this config.
export interface LookupModuleConfig {
  title: string;
  description: string;
  singular: string;
  icon: LucideIcon;
  managePermission: Permission;
  deleteWarning: string;
  useListQuery: typeof useGetDepartmentsQuery;
  useAddMutation: typeof useAddDepartmentMutation;
  useUpdateMutation: typeof useUpdateDepartmentMutation;
  useDeleteMutation: typeof useDeleteDepartmentMutation;
}

export const DEPARTMENT_CONFIG: LookupModuleConfig = {
  title: "Departments",
  description: "Hotel departments that contracts and users are organized by",
  singular: "Department",
  icon: Building2,
  managePermission: PERMISSIONS.MANAGE_DEPARTMENT,
  deleteWarning: "Contracts and users linked to this department will lose their department reference.",
  useListQuery: useGetDepartmentsQuery,
  useAddMutation: useAddDepartmentMutation,
  useUpdateMutation: useUpdateDepartmentMutation,
  useDeleteMutation: useDeleteDepartmentMutation,
};

export const VENDOR_CONFIG: LookupModuleConfig = {
  title: "Vendors",
  description: "Companies and suppliers that have been awarded contracts",
  singular: "Vendor",
  icon: Handshake,
  managePermission: PERMISSIONS.MANAGE_VENDOR,
  deleteWarning: "Contracts awarded to this vendor will lose their vendor reference.",
  useListQuery: useGetVendorsQuery,
  useAddMutation: useAddVendorMutation,
  useUpdateMutation: useUpdateVendorMutation,
  useDeleteMutation: useDeleteVendorMutation,
};
