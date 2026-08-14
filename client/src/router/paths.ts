export const PATHS = {
  HOME: "/",

  // Temporary: uses a dummy workspace id until real workspace routing lands.
  MY_TASKS: "/workspace/dummy/my-tasks",

  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",

  INVITATION_ACCEPT: "/invitations/accept",

  CREATE_WORKSPACE: "/create-workspace",
  COMPLETE_PROFILE: "/complete-profile",
} as const;
