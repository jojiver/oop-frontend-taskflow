import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { Task } from "@/services/task-service";

type DeleteTaskModalProps = {
  task: Task | null;
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onConfirm: (task: Task) => void;
};

export function DeleteTaskModal({
  task,
  open,
  busy,
  onClose,
  onConfirm,
}: DeleteTaskModalProps) {
  if (!task) return null;

  return (
    <Modal open={open} onClose={onClose} size="sm" showClose={false}>
      <div className="pt-1">
        <span className="grid size-11 place-items-center rounded-2xl bg-red-50 text-red-500">
          <Trash2 className="size-5" />
        </span>

        <h2 className="mt-5 text-xl font-bold text-ink">Delete this task?</h2>
        <p className="mt-2 text-sm leading-6 text-ink-2">
          &quot;{task.title}&quot; will be permanently removed. This action
          can&apos;t be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="soft" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" isLoading={busy} onClick={() => onConfirm(task)}>
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
