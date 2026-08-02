import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Mail } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/forgot-password.schema";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import FormHeader from "../components/FormHeader";

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const email = watch("email");

  async function onSubmit(data: ForgotPasswordFormValues) {
    console.log(data);

    await new Promise((resolve) => setTimeout(resolve, 900));

    setSent(true);
  }

  async function handleResend() {
    await new Promise((resolve) => setTimeout(resolve, 900));
  }

  if (sent) {
    return (
      <div className="space-y-7">
        <div className="animate-fade-up">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <CheckCircle2 className="h-6 w-6 text-accent-foreground" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Check your inbox</h1>

          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            We sent a password reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>. It should arrive within a
            minute or two — don't forget to check your spam folder.
          </p>
        </div>

        <div className="space-y-3 animate-fade-up [animation-delay:120ms]">
          <Button type="button" className="w-full" onClick={() => setSent(false)}>
            <Mail className="h-4 w-4" />
            Use a different email
          </Button>

          <Link to="/sign-in">
            <Button variant="outline" type="button" className="w-full">
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          Didn't get the email?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Resend link
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <FormHeader
        title="Reset your password"
        subtitle="Enter your account email and we'll send you a link to set a new password."
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              <>
                Send reset link
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          to="/sign-in"
          className="font-medium text-primary transition-colors hover:text-primary/80"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
