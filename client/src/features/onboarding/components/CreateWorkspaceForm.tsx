import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Loader2 } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createWorkspaceSchema,
  type CreateWorkspaceFormValues,
} from "../schemas/create-workspace.schema";

import { PATHS } from "@/router/paths";

import { apiClient, getApiErrorMessage } from "@/lib/api-client";

import { ErrorAlert } from "@/shared/components/common/ErrorAlert";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { CreateWorkspaceResponse } from "@/features/workspaces/types";

export default function CreateWorkspaceForm() {
  const navigate = useNavigate();

  const [formError, setFormError] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceFormValues>({
    resolver: zodResolver(createWorkspaceSchema),

    defaultValues: {
      name: "",
    },

    mode: "onSubmit",
  });

  async function onSubmit(data: CreateWorkspaceFormValues) {
    setFormError(undefined);

    try {
      await apiClient.post<CreateWorkspaceResponse>("/workspaces", {
        name: data.name,
      });

      navigate(PATHS.APP);
    } catch (error) {
      setFormError(getApiErrorMessage(error));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError && (
        <ErrorAlert title="Unable to create workspace" message={formError} className="mb-4" />
      )}

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Workspace name</FieldLabel>

          <div className="relative">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="name"
              autoComplete="off"
              placeholder="Acme Inc."
              className="pl-9"
              {...register("name")}
            />
          </div>

          <FieldError>{errors.name?.message}</FieldError>
        </Field>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating workspace...
            </>
          ) : (
            <>
              Create workspace
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
