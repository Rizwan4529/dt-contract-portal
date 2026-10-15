import { FileText } from "lucide-react";
import SectionCardCommon from "@/components/common/SectionCardCommon";
import StatusBadge from "@/components/common/StatusBadge";
import DetailFieldCommon from "@/components/common/DetailFieldCommon";
import AttachmentItemCommon from "@/components/common/AttachmentItemCommon";
import { TypographyH3, TypographyLabel, TypographyMuted, TypographyP } from "@/components/common/Typography";
import { formatCurrency, formatDate } from "@/utils/Helpers";
import { getContractTypeLabel, type ContractRow } from "./contractView";

const daysLeftLabel = (daysLeft: number | null) => {
  if (daysLeft === null) return "";
  if (daysLeft < 0) return `Expired ${Math.abs(daysLeft)} days ago`;
  if (daysLeft === 0) return "Expires today";
  return `${daysLeft} days remaining`;
};

const ContractDetail = ({ contract }: { contract: ContractRow }) => {
  const { mainDocument, supportingDocuments } = contract.attachments;
  const hasAttachments = Boolean(mainDocument) || supportingDocuments.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <SectionCardCommon contentClassName="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-primary">
          <FileText className="size-6" />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <TypographyH3>{contract.title}</TypographyH3>
            <StatusBadge status={contract.status} />
          </div>
          <TypographyMuted>
            {contract.vendorName} &middot; {contract.departmentName} &middot; {daysLeftLabel(contract.daysLeft)}
          </TypographyMuted>
        </div>
      </SectionCardCommon>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <SectionCardCommon title="Contract Information">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <DetailFieldCommon label="Vendor / Company" value={contract.vendorName} />
            <DetailFieldCommon label="Department" value={contract.departmentName} />
            <DetailFieldCommon label="Contract Type" value={getContractTypeLabel(contract.type)} />
            <DetailFieldCommon label="Contract Value" value={formatCurrency(contract.amount)} />
            <DetailFieldCommon label="Payment Status" value={<StatusBadge status={contract.paymentStatus} />} />
            <DetailFieldCommon label="Duration" value={contract.duration} />
            <DetailFieldCommon label="Start Date" value={formatDate(contract.startDate)} />
            <DetailFieldCommon label="End Date" value={formatDate(contract.endDate)} />
            <DetailFieldCommon label="Added On" value={formatDate(contract.createdAt)} />
            <DetailFieldCommon label="Last Updated" value={formatDate(contract.updatedAt)} />
          </div>
        </SectionCardCommon>

        <div className="flex flex-col gap-5">
          <SectionCardCommon title="Description">
            <TypographyP className="text-muted-foreground">{contract.description || "No description provided."}</TypographyP>
            {contract.notes && (
              <div className="mt-4 flex flex-col gap-1 rounded-lg bg-muted/60 p-3">
                <TypographyLabel>Remarks</TypographyLabel>
                <TypographyP className="text-muted-foreground">{contract.notes}</TypographyP>
              </div>
            )}
          </SectionCardCommon>

          <SectionCardCommon title="Attachments">
            {hasAttachments ? (
              <div className="flex flex-col gap-4">
                {mainDocument && (
                  <div className="flex flex-col gap-2">
                    <TypographyLabel>Contract File</TypographyLabel>
                    <AttachmentItemCommon path={mainDocument} />
                  </div>
                )}
                {supportingDocuments.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <TypographyLabel>Supporting Documents</TypographyLabel>
                    {supportingDocuments.map((path) => (
                      <AttachmentItemCommon key={path} path={path} />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <TypographyMuted>No files attached.</TypographyMuted>
            )}
          </SectionCardCommon>
        </div>
      </div>
    </div>
  );
};

export default ContractDetail;
