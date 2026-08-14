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
import AcceptInvitationPage from "@/features/invitations/pages/AcceptInvitation";
import AppLayout from "@/app/layouts/Applayout";
import MyTasksPage from "@/features/tasks/pages/MyTasks";
import BoardsPage from "@/features/boards/pages/Boards";
import BacklogPage from "@/features/backlog/pages/Backlog";
import SprintsPage from "@/features/sprints/pages/Sprints";

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
      {
        path: "/workspace/:workspaceId",
        element: <AppLayout />,
        children: [
          { index: true, element: <MyTasksPage /> },
          { path: "my-tasks", element: <MyTasksPage /> },
          { path: "boards", element: <BoardsPage /> },
          { path: "backlog", element: <BacklogPage /> },
          { path: "sprints", element: <SprintsPage /> },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
