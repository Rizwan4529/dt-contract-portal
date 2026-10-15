import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import DialogCommon from "@/components/common/DialogCommon";
import { FormActionsCommon, InputCommon } from "@/components/common/FormCommons";
import { FileUploadCommon } from "@/components/common/FileUploadCommon";
import { useUpdateUserMutation } from "@/app/features/users/usersApi";
import type { User } from "@/types/user";
import { profileSchema, toProfileFormValues, type ProfileFormValues } from "./profileSchema";

interface EditProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

// PATCH /users/:id on the logged-in user (there is no dedicated profile endpoint)
const EditProfile = ({ open, onOpenChange, user }: EditProfileProps) => {
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const form = useForm<ProfileFormValues>({ defaultValues: toProfileFormValues(user), resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (open) form.reset(toProfileFormValues(user));
  }, [open, user, form]);

  const handleFormSubmit = async (values: ProfileFormValues) => {
    try {
      await updateUser({
        id: user._id,
        name: values.name.trim(),
        // backend rejects null / empty here, so only send a new image
        ...(values.profileImage && { profileImage: values.profileImage }),
      }).unwrap();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DialogCommon open={open} onOpenChange={onOpenChange} headerTitle="Edit Profile" headerDescription="Update your name and photo.">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
          <FileUploadCommon control={form.control} name="profileImage" label="Profile Photo" variant="image" />
          <InputCommon control={form.control} name="name" label="Full Name" required placeholder="Your name" />
          <FormActionsCommon submitLabel="Save Changes" isLoading={isLoading} onCancel={() => onOpenChange(false)} />
        </form>
      </Form>
    </DialogCommon>
  );
};

export default EditProfile;
