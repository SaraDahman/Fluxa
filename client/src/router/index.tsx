import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./paths";
import NotFound from "./not-found";
import ProtectedRoute from "./protected-route";
import PublicRoute from "./public-route";
import SignIn from "@/features/auth/pages/SignIn";
import SignUp from "@/features/auth/pages/SignUp";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import AuthLayout from "@/features/auth/components/AuthLayout";
import CreateWorkspace from "@/features/onboarding/pages/CreateWorkspace";
import CompleteProfile from "@/features/onboarding/pages/CompleteProfile";
import AppPage from "@/features/app/pages/App";
import AcceptInvitationPage from "@/features/invitations/pages/AcceptInvitation";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: PATHS.HOME, element: <SignIn /> },
          { path: PATHS.SIGN_IN, element: <SignIn /> },
          { path: PATHS.SIGN_UP, element: <SignUp /> },
          { path: PATHS.FORGOT_PASSWORD, element: <ForgotPassword /> },
        ],
      },
    ],
  },

  {
    element: <AuthLayout />,
    children: [{ path: PATHS.INVITATION_ACCEPT, element: <AcceptInvitationPage /> }],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: PATHS.CREATE_WORKSPACE, element: <CreateWorkspace /> },
          { path: PATHS.COMPLETE_PROFILE, element: <CompleteProfile /> },
        ],
      },

      { path: PATHS.APP, element: <AppPage /> },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
