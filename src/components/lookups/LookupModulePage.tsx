import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeaderCommon from "@/components/common/PageHeaderCommon";
import ConfirmDialogCommon from "@/components/common/ConfirmDialogCommon";
import { FilterBarCommon, SearchInputCommon } from "@/components/common/FilterCommons";
import { PAGE_STACK } from "@/components/layout/adminPageLayout";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { usePermission } from "@/hooks/usePermission";
import { filterBySearch } from "@/utils/Helpers";
import type { LookupEntity } from "@/types/lookup";
import type { LookupModuleConfig } from "./lookupConfig";
import AddUpdateLookup from "./AddUpdateLookup";
import Lookups from "./Lookups";

// Full page for a lookup module (departments / vendors)
const LookupModulePage = ({ config }: { config: LookupModuleConfig }) => {
  const { can } = usePermission();
  const canManage = can(config.managePermission);
  const { search, setSearch, debouncedValue } = useDebouncedSearch();

  const { data = [], isLoading, isFetching } = config.useListQuery();
  const [deleteItem, { isLoading: isDeleting }] = config.useDeleteMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LookupEntity | null>(null);
  const [itemToDelete, setItemToDelete] = useState<LookupEntity | null>(null);

  const items = filterBySearch(data, debouncedValue, (item) => [item.name, item.description]);

  const openForm = (item: LookupEntity | null) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  return (
    <div className={PAGE_STACK}>
      <PageHeaderCommon
        title={config.title}
        description={config.description}
        actions={
          canManage && (
            <Button onClick={() => openForm(null)}>
              <Plus />
              Add {config.singular}
            </Button>
          )
        }
      />

      <FilterBarCommon
        actions={
          <span className="text-sm text-muted-foreground">
            {data.length} {data.length === 1 ? config.singular.toLowerCase() : config.title.toLowerCase()}
          </span>
        }
      >
        <SearchInputCommon
          value={search}
          onChange={setSearch}
          placeholder={`Search ${config.title.toLowerCase()}...`}
        />
      </FilterBarCommon>

      <Lookups
        config={config}
        items={items}
        isLoading={isLoading || isFetching}
        hasSearch={Boolean(debouncedValue.trim())}
        canManage={canManage}
        onEdit={openForm}
        onDelete={setItemToDelete}
      />

      <AddUpdateLookup config={config} open={openDialog} onOpenChange={setOpenDialog} selectedItem={selectedItem} />

      <ConfirmDialogCommon
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title={`Delete ${config.singular.toLowerCase()}?`}
        description={
          itemToDelete && (
            <>
              <span className="font-medium text-foreground">{itemToDelete.name}</span> will be permanently deleted.{" "}
              {config.deleteWarning}
            </>
          )
        }
        isLoading={isDeleting}
        onConfirm={async () => {
          if (itemToDelete) await deleteItem(itemToDelete._id).unwrap();
        }}
      />
    </div>
  );
};

export default LookupModulePage;
