import { Link, useSearchParams } from "react-router-dom";
import MarkerText from "../components/MarkerText";
import GoogleButton from "../components/GoogleButton";
import GitHubButton from "../components/GithubButton";
import SignInForm from "../components/SignInForm";
import FormHeader from "../components/FormHeader";

export default function SignInPage() {
  const [searchParams] = useSearchParams();
  const invitationToken = searchParams.get("token");

  const signUpPath = invitationToken ? `/sign-up?token=${invitationToken}` : "/sign-up";

  return (
    <div className="space-y-7">
      <FormHeader
        title="Welcome back"
        subtitle="Sign in to your workspace to pick up where you left off."
      />

      <SignInForm />

      <MarkerText text="or continue with" />

      <div className="grid grid-cols-2 gap-3">
        <GoogleButton />
        <GitHubButton />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        New to Fluxa?{" "}
        <Link
          to={signUpPath}
          className="font-medium text-primary transition-colors hover:text-primary/80"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
