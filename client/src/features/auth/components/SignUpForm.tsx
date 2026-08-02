import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Loader2, Lock, Mail, User } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signUpSchema, type SignUpFormValues } from "../schemas/sign-up.schema";
import { PasswordInput } from "./PasswordInput";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface Strength {
  score: number;
  label: string;
  color: string;
  width: string;
}

function scorePassword(password: string): Strength {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const map: Strength[] = [
    { score: 0, label: "Too weak", color: "bg-muted", width: "25%" },
    { score: 1, label: "Weak", color: "bg-destructive", width: "50%" },
    { score: 2, label: "Fair", color: "bg-amber-500", width: "75%" },
    { score: 3, label: "Good", color: "bg-lime-500", width: "90%" },
    { score: 4, label: "Strong", color: "bg-emerald-500", width: "100%" },
  ];

  return map[Math.min(score, 4)];
}

const requirements = [
  { test: (password: string) => password.length >= 8, label: "8+ characters" },
  { test: (password: string) => /[A-Z]/.test(password), label: "Uppercase letter" },
  { test: (password: string) => /[0-9]/.test(password), label: "Number" },
  { test: (password: string) => /[^A-Za-z0-9]/.test(password), label: "Symbol" },
];

export default function SignUpForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
    },

    mode: "onSubmit",
  });

  const password = watch("password");

  const strength = useMemo(() => scorePassword(password), [password]);

  async function onSubmit(data: SignUpFormValues) {
    console.log(data);

    await new Promise((r) => setTimeout(r, 900));

    navigate("/app");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Full name</FieldLabel>

          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="name"
              autoComplete="name"
              placeholder="Avery Kim"
              className="pl-9"
              {...register("name")}
            />
          </div>

          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Work email</FieldLabel>

          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

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
          <FieldLabel htmlFor="password">Password</FieldLabel>

          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <PasswordInput
              id="password"
              autoComplete="new-password"
              placeholder="Create a password"
              className="pl-9"
              {...register("password")}
            />
          </div>

          {password.length > 0 && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>

                <span className="ml-3 w-14 text-right text-xs font-medium text-muted-foreground">
                  {strength.label}
                </span>
              </div>

              <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {requirements.map((requirement) => {
                  const passed = requirement.test(password);

                  return (
                    <li
                      key={requirement.label}
                      className={`flex items-center gap-1.5 text-xs transition-colors ${
                        passed ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors ${
                          passed ? "bg-emerald-500 text-white" : "bg-muted"
                        }`}
                      >
                        {passed && <Check className="h-2.5 w-2.5" />}
                      </span>

                      {requirement.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <FieldError>{errors.password?.message}</FieldError>
        </Field>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
