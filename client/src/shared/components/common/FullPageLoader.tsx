import { Spinner } from "@/components/ui/spinner";

export function FullPageLoader() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <Spinner className="size-6" />
    </div>
  );
}
