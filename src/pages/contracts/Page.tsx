import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeaderCommon from "@/components/common/PageHeaderCommon";
import NoticeCommon from "@/components/common/NoticeCommon";
import {
  FilterBarCommon,
  FilterDrawerCommon,
  FilterFieldCommon,
  FilterSelectCommon,
  SearchInputCommon,
} from "@/components/common/FilterCommons";
import { PAGE_STACK } from "@/components/layout/adminPageLayout";
import Contracts from "@/components/contracts/Contracts";
import { useContractList } from "@/hooks/useContractList";
import { usePermission } from "@/hooks/usePermission";
import { CONTRACT_STATUS_LABELS, GLOBAL_ROUTES, PAYMENT_STATUS_LABELS, PERMISSIONS } from "@/utils/Constants";
import { toSelectItems } from "@/utils/Helpers";

const Page = () => {
  const { can } = usePermission();
  const {
    contracts,
    isLoading,
    isPreview,
    search,
    setSearch,
    filters,
    setFilters,
    initialFilters,
    activeCount,
    departmentItems,
    vendorItems,
    typeItems,
  } = useContractList();

  return (
    <div className={PAGE_STACK}>
      <PageHeaderCommon
        title="Contracts"
        description="Search, filter and review all hotel contracts"
        actions={
          can(PERMISSIONS.CREATE_CONTRACT) && (
            <Button asChild>
              <Link to={GLOBAL_ROUTES.ADD_CONTRACT}>
                <Plus />
                Add Contract
              </Link>
            </Button>
          )
        }
      />

      {isPreview && <NoticeCommon>Showing sample contracts. Live data will appear once the contracts API is connected.</NoticeCommon>}

      <FilterBarCommon
        actions={
          <FilterDrawerCommon filters={filters} initialFilters={initialFilters} onApply={setFilters}>
            {(draft, setDraftValue) => (
              <>
                <FilterFieldCommon label="Contract Status">
                  <FilterSelectCommon
                    value={draft.status}
                    onChange={(value) => setDraftValue("status", value)}
                    items={toSelectItems(CONTRACT_STATUS_LABELS)}
                    placeholder="Statuses"
                  />
                </FilterFieldCommon>
                <FilterFieldCommon label="Department">
                  <FilterSelectCommon
                    value={draft.departmentId}
                    onChange={(value) => setDraftValue("departmentId", value)}
                    items={departmentItems}
                    placeholder="Departments"
                  />
                </FilterFieldCommon>
                <FilterFieldCommon label="Vendor / Company">
                  <FilterSelectCommon
                    value={draft.vendorId}
                    onChange={(value) => setDraftValue("vendorId", value)}
                    items={vendorItems}
                    placeholder="Vendors"
                  />
                </FilterFieldCommon>
                <FilterFieldCommon label="Contract Type">
                  <FilterSelectCommon
                    value={draft.type}
                    onChange={(value) => setDraftValue("type", value)}
                    items={typeItems}
                    placeholder="Types"
                  />
                </FilterFieldCommon>
                <FilterFieldCommon label="Payment Status">
                  <FilterSelectCommon
                    value={draft.paymentStatus}
                    onChange={(value) => setDraftValue("paymentStatus", value)}
                    items={toSelectItems(PAYMENT_STATUS_LABELS)}
                    placeholder="Payment Statuses"
                  />
                </FilterFieldCommon>
              </>
            )}
          </FilterDrawerCommon>
        }
      >
        <SearchInputCommon value={search} onChange={setSearch} placeholder="Search contracts..." />
      </FilterBarCommon>

      <Contracts
        contracts={contracts}
        isLoading={isLoading}
        canUpdate={can(PERMISSIONS.UPDATE_CONTRACT)}
        hasFilters={activeCount > 0}
      />
    </div>
  );
};

export default Page;
