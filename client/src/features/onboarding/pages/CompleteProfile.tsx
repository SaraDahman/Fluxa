import FormHeader from "@/features/auth/components/FormHeader";

import CompleteProfileForm from "../components/CompleteProfileForm";

export default function CompleteProfilePage() {
  return (
    <div className="space-y-7">
      <FormHeader
        title="Complete your profile"
        subtitle="Tell your team who you are — add a username, title, and avatar."
      />

      <CompleteProfileForm />
    </div>
  );
}
