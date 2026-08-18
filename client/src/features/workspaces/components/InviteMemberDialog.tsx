import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWorkspaceStore } from "@/store/workspace.store";
import InviteMemberForm from "./InviteMemberForm";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Invite to workspace
          </DialogTitle>
          <DialogDescription>
            Send an invitation by email. They'll join once they accept.
          </DialogDescription>
        </DialogHeader>

        {activeWorkspaceId && (
          <InviteMemberForm
            workspaceId={activeWorkspaceId}
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
