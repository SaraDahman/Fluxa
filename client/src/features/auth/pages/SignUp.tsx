import { Link } from "react-router-dom";
import MarkerText from "../components/MarkerText";
import GoogleButton from "../components/GoogleButton";
import GitHubButton from "../components/GithubButton";
import SignUpForm from "../components/SignUpForm";
import FormHeader from "../components/FormHeader";

export default function SignUpPage() {
  return (
    <div className="space-y-7">
      <FormHeader
        title="Create your account"
        subtitle="Start managing your team's work in minutes. No credit card required."
      />

      <SignUpForm />

      <MarkerText text="or continue with" />

      <div className="grid grid-cols-2 gap-3">
        <GoogleButton />
        <GitHubButton />
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/sign-in"
          className="font-medium text-primary transition-colors hover:text-primary/80"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
