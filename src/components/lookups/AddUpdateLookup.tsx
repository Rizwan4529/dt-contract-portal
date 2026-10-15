import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import DialogCommon from "@/components/common/DialogCommon";
import { FormActionsCommon, InputCommon, TextAreaCommon } from "@/components/common/FormCommons";
import { FileUploadCommon } from "@/components/common/FileUploadCommon";
import type { LookupEntity } from "@/types/lookup";
import type { LookupModuleConfig } from "./lookupConfig";
import {
  lookupInitialValues,
  lookupSchema,
  toLookupFormValues,
  toLookupPayload,
  type LookupFormValues,
} from "./lookupSchema";

interface AddUpdateLookupProps {
  config: LookupModuleConfig;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: LookupEntity | null;
}

const AddUpdateLookup = ({ config, open, onOpenChange, selectedItem }: AddUpdateLookupProps) => {
  const isEdit = Boolean(selectedItem);
  const [addItem, { isLoading: isAdding }] = config.useAddMutation();
  const [updateItem, { isLoading: isUpdating }] = config.useUpdateMutation();

  const form = useForm<LookupFormValues>({ defaultValues: lookupInitialValues, resolver: zodResolver(lookupSchema) });

  useEffect(() => {
    if (open) form.reset(selectedItem ? toLookupFormValues(selectedItem) : lookupInitialValues);
  }, [open, selectedItem, form]);

  const handleFormSubmit = async (values: LookupFormValues) => {
    try {
      const payload = toLookupPayload(values);
      if (selectedItem) {
        await updateItem({ id: selectedItem._id, ...payload }).unwrap();
      } else {
        await addItem(payload).unwrap();
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const singular = config.singular.toLowerCase();

  return (
    <DialogCommon
      open={open}
      onOpenChange={onOpenChange}
      headerTitle={isEdit ? `Edit ${config.singular}` : `Add ${config.singular}`}
      headerDescription={isEdit ? `Update the ${singular} details.` : `Create a new ${singular}.`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
          <InputCommon
            control={form.control}
            name="name"
            label={`${config.singular} Name`}
            required
            placeholder={`Enter ${singular} name`}
          />
          <TextAreaCommon
            control={form.control}
            name="description"
            label="Description"
            placeholder="Short description (optional)"
          />
          <FileUploadCommon control={form.control} name="image" label="Image / Logo" variant="image" />
          <FormActionsCommon
            submitLabel={isEdit ? `Update ${config.singular}` : `Add ${config.singular}`}
            isLoading={isAdding || isUpdating}
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </Form>
    </DialogCommon>
  );
};

export default AddUpdateLookup;
