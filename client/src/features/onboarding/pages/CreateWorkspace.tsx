import FormHeader from "@/features/auth/components/FormHeader";

import CreateWorkspaceForm from "../components/CreateWorkspaceForm";

export default function CreateWorkspacePage() {
  return (
    <div className="space-y-7">
      <FormHeader
        title="Create your workspace"
        subtitle="Give your workspace a name — you can always change it later."
      />

      <CreateWorkspaceForm />
    </div>
  );
}
