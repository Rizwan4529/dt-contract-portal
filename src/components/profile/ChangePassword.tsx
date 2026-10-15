import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import DialogCommon from "@/components/common/DialogCommon";
import { FormActionsCommon, InputCommon } from "@/components/common/FormCommons";
import { useUpdateUserMutation } from "@/app/features/users/usersApi";
import {
  newPasswordInitialValues,
  newPasswordSchema,
  type NewPasswordFormValues,
} from "@/components/auth/AuthSchema";

interface ChangePasswordProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const ChangePassword = ({ open, onOpenChange, userId }: ChangePasswordProps) => {
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const form = useForm<NewPasswordFormValues>({
    defaultValues: newPasswordInitialValues,
    resolver: zodResolver(newPasswordSchema),
  });

  useEffect(() => {
    if (open) form.reset(newPasswordInitialValues);
  }, [open, form]);

  const handleFormSubmit = async (values: NewPasswordFormValues) => {
    try {
      await updateUser({ id: userId, password: values.password }).unwrap();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DialogCommon
      open={open}
      onOpenChange={onOpenChange}
      headerTitle="Change Password"
      headerDescription="Choose a strong password with at least 8 characters."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
          <InputCommon
            control={form.control}
            name="password"
            label="New Password"
            required
            inputType="password"
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
          />
          <InputCommon
            control={form.control}
            name="confirmPassword"
            label="Confirm Password"
            required
            inputType="password"
            autoComplete="new-password"
            placeholder="Re-enter new password"
          />
          <FormActionsCommon submitLabel="Update Password" isLoading={isLoading} onCancel={() => onOpenChange(false)} />
        </form>
      </Form>
    </DialogCommon>
  );
};

export default ChangePassword;
