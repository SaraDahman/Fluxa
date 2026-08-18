import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";

import {
  createWorkspaceSchema,
  type CreateWorkspaceFormValues,
} from "../schemas/create-workspace.schema";
import { useCreateWorkspace } from "../api/workspaces";
import { getApiErrorMessage } from "@/lib/api-client";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { workspacePalette } from "@/constants/colors";

interface CreateWorkspaceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateWorkspaceForm({ onSuccess, onCancel }: CreateWorkspaceFormProps) {
  const createWorkspace = useCreateWorkspace();

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),

    defaultValues: {
      name: "",
      color: undefined,
    },

    mode: "onSubmit",
  });

  function onSubmit(_data: CreateWorkspaceFormValues) {
    createWorkspace.mutate(
      { name: _data.name, color: _data.color },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (error) => {
          setError("root", { message: getApiErrorMessage(error) });
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {errors.root && <p className="text-sm text-destructive">{errors.root.message}</p>}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
          <Input
            id="workspace-name"
            autoFocus
            autoComplete="off"
            placeholder="e.g. Acme Studio"
            disabled={createWorkspace.isPending}
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
                    disabled={createWorkspace.isPending}
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
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={createWorkspace.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createWorkspace.isPending}>
          {createWorkspace.isPending ? (
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
