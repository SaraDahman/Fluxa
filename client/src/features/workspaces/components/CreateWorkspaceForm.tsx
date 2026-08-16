import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";

import {
  createWorkspaceSchema,
  type CreateWorkspaceFormValues,
} from "../schemas/create-workspace.schema";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { workspacePalette } from "@/constants/colors";

interface CreateWorkspaceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateWorkspaceForm({ onSuccess, onCancel }: CreateWorkspaceFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),

    defaultValues: {
      name: "",
      color: "",
    },

    mode: "onSubmit",
  });

  async function onSubmit(_data: CreateWorkspaceFormValues) {
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
          <Input
            id="workspace-name"
            autoFocus
            autoComplete="off"
            placeholder="e.g. Acme Studio"
            {...register("name")}
          />

          <FieldError>{errors.name?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel>Color</FieldLabel>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                {workspacePalette.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`Select color ${c}`}
                    onClick={() => field.onChange(c)}
                    className="h-6 w-6 rounded-full ring-offset-2 ring-offset-background transition-transform hover:scale-110"
                    style={{
                      background: c,
                      boxShadow: field.value === c ? `0 0 0 2px ${c}` : "none",
                    }}
                  />
                ))}
              </div>
            )}
          />

          <FieldError>{errors.color?.message}</FieldError>
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
          Create workspace
        </Button>
      </div>
    </form>
  );
}
