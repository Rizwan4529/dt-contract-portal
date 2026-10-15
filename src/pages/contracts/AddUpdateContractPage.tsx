import { useParams } from "react-router-dom";
import PageHeaderCommon from "@/components/common/PageHeaderCommon";
import NoticeCommon from "@/components/common/NoticeCommon";
import { PAGE_STACK } from "@/components/layout/adminPageLayout";
import AddUpdateContract from "@/components/contracts/AddUpdateContract";
import { findPreviewContract } from "@/hooks/useContractList";
import { GLOBAL_ROUTES } from "@/utils/Constants";

// Serves both /contracts/add and /contracts/update/:id
const AddUpdateContractPage = () => {
  const { id } = useParams();
  const selectedContract = id ? findPreviewContract(id) : null;
  const isEdit = Boolean(id);

  return (
    <div className={PAGE_STACK}>
      <PageHeaderCommon
        title={isEdit ? "Edit Contract" : "Add New Contract"}
        backTo={{ label: "Back to Contracts", path: GLOBAL_ROUTES.CONTRACTS }}
      />
      <NoticeCommon>The contract form is UI-only for now. File uploads work; saving is enabled once the contracts API is connected.</NoticeCommon>
      <AddUpdateContract key={id ?? "new"} selectedContract={selectedContract} />
    </div>
  );
};

export default AddUpdateContractPage;
