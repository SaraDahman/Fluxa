import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase, Camera, Loader2, UserRound } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  completeProfileSchema,
  type CompleteProfileFormValues,
} from "../schemas/complete-profile.schema";

import { PATHS } from "@/router/paths";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function CompleteProfileForm() {
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState<File | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),

    defaultValues: {
      username: "",
      title: "",
    },

    mode: "onSubmit",
  });

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAvatar(file);

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarPreview(URL.createObjectURL(file));
  }

  function handleRemoveAvatar() {
    setAvatar(undefined);

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarPreview(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(data: CompleteProfileFormValues) {
    console.log({ ...data, avatar });

    await new Promise((r) => setTimeout(r, 900));

    navigate(PATHS.HOME);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            aria-label="Upload avatar"
            onClick={() => fileInputRef.current?.click()}
            className="group relative cursor-pointer rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Avatar className="size-24">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="Avatar preview" />
              ) : (
                <AvatarFallback>
                  <UserRound className="size-8 text-muted-foreground" />
                </AvatarFallback>
              )}
            </Avatar>

            <span className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-background">
              <Camera className="size-4" />
            </span>
          </button>

          <div className="flex items-center gap-3">
            {/* <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              Change photo
            </Button> */}

            {avatarPreview && (
              <Button type="button" variant="ghost" size="sm" onClick={handleRemoveAvatar}>
                Remove
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>

          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="username"
              autoComplete="username"
              placeholder="avery_kim"
              className="pl-9"
              {...register("username")}
            />
          </div>

          <FieldError>{errors.username?.message}</FieldError>
        </Field>

        <Field>
          <FieldLabel htmlFor="title">
            Title <span className="font-normal text-muted-foreground">(optional)</span>
          </FieldLabel>

          <div className="relative">
            <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="title"
              autoComplete="organization-title"
              placeholder="Software Engineer"
              className="pl-9"
              {...register("title")}
            />
          </div>

          <FieldError>{errors.title?.message}</FieldError>
        </Field>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving profile...
            </>
          ) : (
            <>
              Complete profile
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
}
