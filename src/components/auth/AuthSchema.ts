import { z } from "zod";
import { APP_CONSTANTS } from "@/utils/Constants";

const MIN = APP_CONSTANTS.MIN_PASSWORD_LENGTH;

const emailField = z.string().trim().min(1, "Email is required").pipe(z.email("Enter a valid email address"));

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ------------------------------------------------------------------
//  Forgot password: email -> OTP -> new password
// ------------------------------------------------------------------
export const forgotPasswordSchema = z.object({ email: emailField });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const otpSchema = z.object({
  otp: z
    .string()
    .length(APP_CONSTANTS.OTP_LENGTH, `Enter the ${APP_CONSTANTS.OTP_LENGTH}-digit code`)
    .regex(/^\d+$/, "Code must contain digits only"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

// Also used by "Change Password" on the profile page
export const newPasswordSchema = z
  .object({
    password: z.string().min(MIN, `Password must be at least ${MIN} characters`),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

export const newPasswordInitialValues: NewPasswordFormValues = { password: "", confirmPassword: "" };
