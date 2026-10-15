import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import DialogCommon from "@/components/common/DialogCommon";
import { FormActionsCommon, InputCommon, SelectCommon } from "@/components/common/FormCommons";
import { useAddUserMutation, useUpdateUserMutation } from "@/app/features/users/usersApi";
import { usePermission } from "@/hooks/usePermission";
import { getManageableRoles } from "@/utils/permissions";
import { DEPARTMENT_SCOPED_ROLES, ROLE_LABELS } from "@/utils/Constants";
import type { SelectItem } from "@/types/api";
import type { User } from "@/types/user";
import {
  getUserSchema,
  toCreateUserPayload,
  toUpdateUserPayload,
  toUserFormValues,
  userInitialValues,
  type UserFormValues,
} from "./userSchema";

interface AddUpdateUserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: User | null;
  departmentItems: SelectItem[];
}

const AddUpdateUser = ({ open, onOpenChange, selectedUser, departmentItems }: AddUpdateUserProps) => {
  const isEdit = Boolean(selectedUser);
  const { role: actorRole } = usePermission();
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const form = useForm<UserFormValues>({
    defaultValues: userInitialValues,
    resolver: zodResolver(getUserSchema(isEdit)),
  });
  const role = useWatch({ control: form.control, name: "role" });
  const needsDepartment = DEPARTMENT_SCOPED_ROLES.includes(role);

  // Only roles at or below the actor's level can be assigned
  const roleItems = getManageableRoles(actorRole).map((value) => ({ value, label: ROLE_LABELS[value] }));

  useEffect(() => {
    if (open) form.reset(selectedUser ? toUserFormValues(selectedUser) : userInitialValues);
  }, [open, selectedUser, form]);

  const handleFormSubmit = async (values: UserFormValues) => {
    try {
      if (selectedUser) {
        await updateUser(toUpdateUserPayload(selectedUser._id, values)).unwrap();
      } else {
        await addUser(toCreateUserPayload(values)).unwrap();
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DialogCommon
      open={open}
      onOpenChange={onOpenChange}
      headerTitle={isEdit ? "Edit User" : "Add User"}
      headerDescription={isEdit ? "Update the user's details and access." : "Create a portal account for a team member."}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
          <InputCommon control={form.control} name="name" label="Full Name" required placeholder="e.g. Sara Khan" />
          <InputCommon
            control={form.control}
            name="email"
            label="Email"
            required
            inputType="email"
            placeholder="name@daraltaqwa.com"
            disabled={isEdit}
            description={isEdit ? "Email cannot be changed." : undefined}
          />
          <InputCommon
            control={form.control}
            name="password"
            label={isEdit ? "New Password" : "Password"}
            required={!isEdit}
            inputType="password"
            placeholder={isEdit ? "Leave blank to keep current password" : "Minimum 8 characters"}
            autoComplete="new-password"
          />
          <SelectCommon
            control={form.control}
            name="role"
            label="Role"
            required
            items={roleItems}
            placeholder="Select role"
            onValueChange={(value) => {
              if (!DEPARTMENT_SCOPED_ROLES.includes(value)) form.setValue("departmentId", "");
            }}
          />
          {needsDepartment && (
            <SelectCommon
              control={form.control}
              name="departmentId"
              label="Department"
              required
              items={departmentItems}
              placeholder="Select department"
              description="Heads of department and viewers only see contracts of their department."
            />
          )}
          <FormActionsCommon
            submitLabel={isEdit ? "Update User" : "Add User"}
            isLoading={isAdding || isUpdating}
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </Form>
    </DialogCommon>
  );
};

export default AddUpdateUser;
