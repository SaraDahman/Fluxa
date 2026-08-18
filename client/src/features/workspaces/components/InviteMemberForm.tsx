import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Mail } from "lucide-react";

import { inviteMemberSchema, type InviteMemberFormValues } from "../schemas/invite-member.schema";
import { useInviteMember } from "../api/workspaces";
import { getApiErrorMessage } from "@/lib/api-client";

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
  { value: "MEMBER" as const, label: "Member — can view and edit issues" },
  { value: "ADMIN" as const, label: "Admin — can manage members and settings" },
];

interface InviteMemberFormProps {
  workspaceId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function InviteMemberForm({
  workspaceId,
  onSuccess,
  onCancel,
}: InviteMemberFormProps) {
  const inviteMember = useInviteMember(workspaceId);

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<InviteMemberFormValues>({
    resolver: zodResolver(inviteMemberSchema),

    defaultValues: {
      email: "",
      role: "MEMBER",
    },

    mode: "onSubmit",
  });

  async function onSubmit(data: InviteMemberFormValues) {
    inviteMember.mutate(data, {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (error) => {
        setError("root", { message: getApiErrorMessage(error) });
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}

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
              disabled={inviteMember.isPending}
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
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={inviteMember.isPending}
              >
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
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={inviteMember.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={inviteMember.isPending}>
          {inviteMember.isPending ? (
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
