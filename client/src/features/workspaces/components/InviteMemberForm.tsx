import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Mail } from "lucide-react";

import { inviteMemberSchema, type InviteMemberFormValues } from "../schemas/invite-member.schema";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roles = [
  { value: "member", label: "Member — can view and edit issues" },
  { value: "admin", label: "Admin — can manage members and settings" },
  { value: "owner", label: "Owner — can manage members and settings" },
] as const;

interface InviteMemberFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function InviteMemberForm({ onSuccess, onCancel }: InviteMemberFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),

    defaultValues: {
      email: "",
      role: "member",
    },

    mode: "onSubmit",
  });

  async function onSubmit(_data: InviteMemberFormValues) {
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="invite-email">Email address</FieldLabel>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="invite-email"
              type="email"
              autoFocus
              autoComplete="email"
              placeholder="teammate@company.com"
              className="pl-9"
              {...register("email")}
            />
          </div>
          <FieldError>{errors.email?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="invite-role">Role</FieldLabel>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="invite-role" className="w-full" aria-invalid={!!errors.role}>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="w-full">
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <FieldError>{errors.role?.message}</FieldError>
        </Field>
      </FieldGroup>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
          Send invite
        </Button>
      </div>
    </form>
  );
}
