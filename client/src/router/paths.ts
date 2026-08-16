export const PATHS = {
  HOME: "/",

  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",

  INVITATION_ACCEPT: "/invitations/accept",

  CREATE_WORKSPACE: "/create-workspace",
  COMPLETE_PROFILE: "/complete-profile",
  SELECT_WORKSPACE: "/select-workspace",
} as const;

export function workspacePath(slug: string) {
  return `/${slug}`;
}

export function workspaceSubPath(slug: string, sub: string) {
  return `/${slug}/${sub}`;
}
