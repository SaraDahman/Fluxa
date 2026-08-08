import { CircleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorAlertProps {
  title: string;
  message: string;
  className?: string;
}

export function ErrorAlert({ title, message, className }: ErrorAlertProps) {
  return (
    <Alert variant="destructive" className={className}>
      <CircleAlert className="size-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
