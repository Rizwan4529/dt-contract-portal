import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputCommon, OtpInputCommon } from "@/components/common/FormCommons";
import AuthLayout from "@/components/layout/AuthLayout";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOtpMutation,
} from "@/app/features/auth/authApi";
import { GLOBAL_ROUTES } from "@/utils/Constants";
import { cn } from "@/lib/utils";
import {
  forgotPasswordSchema,
  newPasswordInitialValues,
  newPasswordSchema,
  otpSchema,
  type ForgotPasswordFormValues,
  type NewPasswordFormValues,
  type OtpFormValues,
} from "./AuthSchema";

type Step = "email" | "otp" | "reset";

const STEPS: Record<Step, { title: string; description: string }> = {
  email: { title: "Forgot Password", description: "Enter your email and we will send you a verification code" },
  otp: { title: "Verify Code", description: "Enter the 6-digit code sent to your email" },
  reset: { title: "Set New Password", description: "Choose a new password for your account" },
};
const STEP_ORDER: Step[] = ["email", "otp", "reset"];

// Each step returns a fresh resetPasswordToken that the next step must send back
const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [forgotPassword, { isLoading: isSending }] = useForgotPasswordMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const emailForm = useForm<ForgotPasswordFormValues>({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotPasswordSchema),
  });
  const otpForm = useForm<OtpFormValues>({ defaultValues: { otp: "" }, resolver: zodResolver(otpSchema) });
  const passwordForm = useForm<NewPasswordFormValues>({
    defaultValues: newPasswordInitialValues,
    resolver: zodResolver(newPasswordSchema),
  });

  const sendCode = async (values: ForgotPasswordFormValues) => {
    try {
      const { resetPasswordToken } = await forgotPassword({ email: values.email }).unwrap();
      setEmail(values.email);
      setResetToken(resetPasswordToken);
      otpForm.reset({ otp: "" });
      setStep("otp");
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerify = async (values: OtpFormValues) => {
    try {
      const { resetPasswordToken } = await verifyOtp({ resetPasswordToken: resetToken, otp: values.otp }).unwrap();
      setResetToken(resetPasswordToken);
      setStep("reset");
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = async (values: NewPasswordFormValues) => {
    try {
      await resetPassword({ resetPasswordToken: resetToken, newPassword: values.password }).unwrap();
      toast.success("Password reset successfully. Please log in with your new password.");
      navigate(GLOBAL_ROUTES.LOGIN, { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  const { title, description } = STEPS[step];
  const currentIndex = STEP_ORDER.indexOf(step);

  return (
    <AuthLayout
      title={title}
      description={
        step === "otp" ? (
          <>
            Enter the 6-digit code sent to <span className="font-medium text-foreground">{email}</span>
          </>
        ) : (
          description
        )
      }
    >
      <div className="flex justify-center gap-2" aria-hidden="true">
        {STEP_ORDER.map((item, index) => (
          <span
            key={item}
            className={cn("h-1.5 w-10 rounded-full bg-border transition-colors", index <= currentIndex && "bg-primary")}
          />
        ))}
      </div>

      {step === "email" && (
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(sendCode)} className="flex flex-col gap-4" noValidate>
            <InputCommon
              control={emailForm.control}
              name="email"
              label="Email"
              inputType="email"
              icon={Mail}
              placeholder="you@daraltaqwa.com"
              autoComplete="email"
            />
            <Button type="submit" size="xl" className="w-full" isLoading={isSending}>
              Send Code
            </Button>
          </form>
        </Form>
      )}

      {step === "otp" && (
        <Form {...otpForm}>
          <form onSubmit={otpForm.handleSubmit(handleVerify)} className="flex flex-col gap-5" noValidate>
            <OtpInputCommon control={otpForm.control} name="otp" />
            <Button type="submit" size="xl" className="w-full" isLoading={isVerifying}>
              Verify Code
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Didn&apos;t get the code?{" "}
              <button
                type="button"
                disabled={isSending}
                onClick={() => sendCode({ email })}
                className="cursor-pointer font-medium text-primary hover:underline disabled:opacity-50"
              >
                Resend
              </button>
            </p>
          </form>
        </Form>
      )}

      {step === "reset" && (
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(handleReset)} className="flex flex-col gap-4" noValidate>
            <InputCommon
              control={passwordForm.control}
              name="password"
              label="New Password"
              inputType="password"
              icon={Lock}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
            />
            <InputCommon
              control={passwordForm.control}
              name="confirmPassword"
              label="Confirm Password"
              inputType="password"
              icon={Lock}
              placeholder="Re-enter new password"
              autoComplete="new-password"
            />
            <Button type="submit" size="xl" className="w-full" isLoading={isResetting}>
              Reset Password
            </Button>
          </form>
        </Form>
      )}

      <Link
        to={GLOBAL_ROUTES.LOGIN}
        className="mx-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to Login
      </Link>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
