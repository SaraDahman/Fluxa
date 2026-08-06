import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signInSchema, type SignInFormValues } from "../schemas/sign-in.schema";

import { PasswordInput } from "./PasswordInput";

import { PATHS } from "@/router/paths";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function SignInForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
    mode: "onSubmit",
  });

  async function onSubmit(data: SignInFormValues) {
    console.log(data);

    await new Promise((r) => setTimeout(r, 900));

    navigate(PATHS.CREATE_WORKSPACE);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>

          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className="pl-9"
              {...register("email")}
            />
          </div>

          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>

            <Link
              to="/forgot-password"
              className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="pl-9"
              {...register("password")}
            />
          </div>

          <FieldError>{errors.password?.message}</FieldError>
        </Field>

        <Field orientation="horizontal">
          <Checkbox id="remember" {...register("remember")} />

          <FieldLabel htmlFor="remember" className="font-normal text-muted-foreground">
            Keep me signed in on this device
          </FieldLabel>
        </Field>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
