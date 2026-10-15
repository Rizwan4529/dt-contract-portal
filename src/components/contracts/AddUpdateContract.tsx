import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import SectionCardCommon from "@/components/common/SectionCardCommon";
import {
  DatePickerCommon,
  FormActionsCommon,
  InputCommon,
  SelectCommon,
  TextAreaCommon,
} from "@/components/common/FormCommons";
import { FileUploadCommon } from "@/components/common/FileUploadCommon";
import { FORM_GRID } from "@/components/layout/adminPageLayout";
import { useLookupOptions } from "@/hooks/useLookupOptions";
import { CONTRACT_TYPE_LABELS, FILE_UPLOAD, GLOBAL_ROUTES, PAYMENT_STATUS_LABELS } from "@/utils/Constants";
import { formatDuration, toSelectItems } from "@/utils/Helpers";
import type { Contract } from "@/types/contract";
import {
  contractInitialValues,
  contractSchema,
  toContractFormValues,
  toContractPayload,
  type ContractFormValues,
} from "./contractSchema";

interface AddUpdateContractProps {
  selectedContract?: Contract | null;
}

const AddUpdateContract = ({ selectedContract = null }: AddUpdateContractProps) => {
  const navigate = useNavigate();
  const isEdit = Boolean(selectedContract);
  const { departmentItems, vendorItems, isLoading: isLookupLoading } = useLookupOptions();

  const form = useForm<ContractFormValues>({
    defaultValues: selectedContract ? toContractFormValues(selectedContract) : contractInitialValues,
    resolver: zodResolver(contractSchema),
  });
  const [startDate, endDate] = useWatch({ control: form.control, name: ["startDate", "endDate"] });

  // Keep duration in sync with the selected dates (still editable)
  useEffect(() => {
    const duration = formatDuration(startDate, endDate);
    if (duration) form.setValue("duration", duration);
  }, [startDate, endDate, form]);

  // UI only for now: the payload is built exactly as the backend expects
  const handleFormSubmit = (values: ContractFormValues) => {
    const payload = toContractPayload(values);
    console.info("Contract payload", payload);
    toast.info("Contract form is ready. Saving will work once the contracts API is connected.");
  };

  return (
    <SectionCardCommon>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-5" noValidate>
          <div className={FORM_GRID}>
            <InputCommon control={form.control} name="title" label="Contract Title" required placeholder="Enter contract title" />
            <SelectCommon
              control={form.control}
              name="vendorId"
              label="Vendor / Company"
              required
              items={vendorItems}
              isLoading={isLookupLoading}
              placeholder="Select vendor"
            />
            <SelectCommon
              control={form.control}
              name="departmentId"
              label="Department"
              required
              items={departmentItems}
              isLoading={isLookupLoading}
              placeholder="Select department"
            />
            <SelectCommon
              control={form.control}
              name="type"
              label="Contract Type"
              required
              items={toSelectItems(CONTRACT_TYPE_LABELS)}
              placeholder="Select type"
            />
            <InputCommon
              control={form.control}
              name="amount"
              label="Contract Value (SAR)"
              required
              inputType="number"
              min={0}
              step="0.01"
              placeholder="Enter amount"
            />
            <SelectCommon
              control={form.control}
              name="paymentStatus"
              label="Payment Status"
              required
              items={toSelectItems(PAYMENT_STATUS_LABELS)}
              placeholder="Select status"
            />
            <DatePickerCommon control={form.control} name="startDate" label="Start Date" required />
            <DatePickerCommon control={form.control} name="endDate" label="End Date" required minDate={startDate} />
            <InputCommon
              control={form.control}
              name="duration"
              label="Duration"
              placeholder="Calculated from dates"
              description="Auto-filled from the start and end dates. You can adjust it."
            />
          </div>

          <TextAreaCommon control={form.control} name="description" label="Description" placeholder="Enter short description (optional)" />
          <TextAreaCommon control={form.control} name="notes" label="Remarks / Notes" placeholder="Any remarks about this contract (optional)" />

          <div className={FORM_GRID}>
            <FileUploadCommon control={form.control} name="mainDocument" label="Attach Contract File" required />
            <FileUploadCommon
              control={form.control}
              name="supportingDocuments"
              label="Additional Documents (Proof, Invoices, etc.)"
              multiple
              maxFiles={FILE_UPLOAD.MAX_FILES - 1}
            />
          </div>

          <FormActionsCommon
            align="start"
            submitLabel={isEdit ? "Update Contract" : "Save Contract"}
            onCancel={() => navigate(GLOBAL_ROUTES.CONTRACTS)}
          />
        </form>
      </Form>
    </SectionCardCommon>
  );
};

export default AddUpdateContract;
