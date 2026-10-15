import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputCommon } from "@/components/common/FormCommons";
import AuthLayout from "@/components/layout/AuthLayout";
import { useLoginMutation } from "@/app/features/auth/authApi";
import { APP_CONSTANTS, GLOBAL_ROUTES } from "@/utils/Constants";
import { loginSchema, type LoginFormValues } from "./AuthSchema";

const initialValues: LoginFormValues = { email: "", password: "" };

// Redirect after login is handled by AppBootstrap (isAuthRoute)
const LoginPage = () => {
  const [login, { isLoading }] = useLoginMutation();
  const form = useForm<LoginFormValues>({ defaultValues: initialValues, resolver: zodResolver(loginSchema) });

  const handleFormSubmit = async (values: LoginFormValues) => {
    try {
      await login(values).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthLayout title={APP_CONSTANTS.APP_TITLE} description="Secure access to hotel contracts">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
          <InputCommon
            control={form.control}
            name="email"
            label="Email"
            inputType="email"
            icon={Mail}
            placeholder="you@daraltaqwa.com"
            autoComplete="email"
          />
          <InputCommon
            control={form.control}
            name="password"
            label="Password"
            inputType="password"
            icon={Lock}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          <Button type="submit" size="xl" className="mt-2 w-full" isLoading={isLoading}>
            Login
          </Button>
          <Link
            to={GLOBAL_ROUTES.FORGOT_PASSWORD}
            className="mx-auto text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Forgot Password?
          </Link>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default LoginPage;
