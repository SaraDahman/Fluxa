import { createBrowserRouter } from "react-router-dom";
import { PATHS } from "./paths";
import NotFound from "./not-found";
import SignIn from "@/features/auth/pages/SignIn";
import SignUp from "@/features/auth/pages/SignUp";
import ForgotPassword from "@/features/auth/pages/ForgotPassword";
import AuthLayout from "@/features/auth/components/AuthLayout";

console.log("Router initialized with paths:", PATHS);

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: PATHS.HOME, element: <SignIn /> },
      { path: PATHS.SIGN_IN, element: <SignIn /> },
      { path: PATHS.SIGN_UP, element: <SignUp /> },
      { path: PATHS.FORGOT_PASSWORD, element: <ForgotPassword /> },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);
