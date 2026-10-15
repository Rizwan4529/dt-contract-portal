import { z } from "zod";
import { APP_CONSTANTS, DEPARTMENT_SCOPED_ROLES } from "@/utils/Constants";
import type { CreateUserPayload, Role, UpdateUserPayload, User } from "@/types/user";

const MIN = APP_CONSTANTS.MIN_PASSWORD_LENGTH;
const passwordMessage = `Password must be at least ${MIN} characters`;

// Password is required on create and optional on edit (blank = keep current)
export const getUserSchema = (isEdit: boolean) =>
  z
    .object({
      name: z.string().trim().min(1, "Name is required"),
      email: z.string().trim().min(1, "Email is required").pipe(z.email("Enter a valid email address")),
      password: isEdit
        ? z.string().refine((value) => !value || value.length >= MIN, passwordMessage)
        : z.string().min(MIN, passwordMessage),
      role: z.string().min(1, "Role is required"),
      departmentId: z.string(),
    })
    // hod / user must belong to a department (backend role-scope rule)
    .superRefine((data, ctx) => {
      if (DEPARTMENT_SCOPED_ROLES.includes(data.role) && !data.departmentId) {
        ctx.addIssue({ code: "custom", path: ["departmentId"], message: "Department is required for this role" });
      }
    });

export type UserFormValues = z.infer<ReturnType<typeof getUserSchema>>;

export const userInitialValues: UserFormValues = {
  name: "",
  email: "",
  password: "",
  role: "",
  departmentId: "",
};

export const toUserFormValues = (user: User): UserFormValues => ({
  name: user.name ?? "",
  email: user.email,
  password: "",
  role: user.role,
  departmentId: user.departmentId ?? "",
});

const isScoped = (role: string) => DEPARTMENT_SCOPED_ROLES.includes(role);

export const toCreateUserPayload = (values: UserFormValues): CreateUserPayload => ({
  name: values.name.trim(),
  email: values.email.trim(),
  password: values.password,
  role: values.role as Role,
  // departmentId must be omitted for non-scoped roles
  ...(isScoped(values.role) && { departmentId: values.departmentId }),
});

// Email / status are not updatable through PATCH (strict schema on the backend)
export const toUpdateUserPayload = (id: string, values: UserFormValues): UpdateUserPayload => ({
  id,
  name: values.name.trim(),
  role: values.role as Role,
  departmentId: isScoped(values.role) ? values.departmentId : null,
  ...(values.password && { password: values.password }),
});
