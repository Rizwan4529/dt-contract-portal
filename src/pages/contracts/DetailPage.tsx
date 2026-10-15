import { generatePath, Link, useParams } from "react-router-dom";
import { FileX2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHeaderCommon from "@/components/common/PageHeaderCommon";
import EmptyStateCommon from "@/components/common/EmptyStateCommon";
import NoticeCommon from "@/components/common/NoticeCommon";
import SectionCardCommon from "@/components/common/SectionCardCommon";
import { PAGE_STACK } from "@/components/layout/adminPageLayout";
import ContractDetail from "@/components/contracts/ContractDetail";
import { findPreviewContract } from "@/hooks/useContractList";
import { usePermission } from "@/hooks/usePermission";
import { GLOBAL_ROUTES, PERMISSIONS } from "@/utils/Constants";

const DetailPage = () => {
  const { id } = useParams();
  const { can } = usePermission();
  // UI preview: swap for useGetContractQuery(id) + toContractRow once the API is connected
  const contract = findPreviewContract(id);

  return (
    <div className={PAGE_STACK}>
      <PageHeaderCommon
        title="Contract Details"
        backTo={{ label: "Back to Contracts", path: GLOBAL_ROUTES.CONTRACTS }}
        actions={
          contract &&
          can(PERMISSIONS.UPDATE_CONTRACT) && (
            <Button asChild variant="soft">
              <Link to={generatePath(GLOBAL_ROUTES.UPDATE_CONTRACT, { id: contract._id })}>
                <Pencil />
                Edit
              </Link>
            </Button>
          )
        }
      />

      <NoticeCommon>Showing a sample contract. Live data will appear once the contracts API is connected.</NoticeCommon>

      {contract ? (
        <ContractDetail contract={contract} />
      ) : (
        <SectionCardCommon>
          <EmptyStateCommon
            icon={FileX2}
            title="Contract not found"
            description="It may have been removed, or you may not have access to it."
            action={
              <Button asChild variant="outline">
                <Link to={GLOBAL_ROUTES.CONTRACTS}>Back to Contracts</Link>
              </Button>
            }
          />
        </SectionCardCommon>
      )}
    </div>
  );
};

export default DetailPage;
