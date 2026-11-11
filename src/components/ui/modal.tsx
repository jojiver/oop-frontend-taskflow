import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

type ModalSize = "sm" | "md" | "lg";

const SIZES: Record<ModalSize, string> = {
  sm: "max-w-[440px]",
  md: "max-w-[600px]",
  lg: "max-w-[640px]",
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  children: ReactNode;
  className?: string;
  showClose?: boolean;
};

export function Modal({
  open,
  onClose,
  size = "md",
  children,
  className,
  showClose = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative max-h-[92vh] w-full overflow-y-auto rounded-3xl bg-white p-6 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.45)] sm:p-7",
          SIZES[size],
          className,
        )}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200" />

        {showClose && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-5 right-5 grid size-8 cursor-pointer place-items-center rounded-lg text-ink-3 transition hover:bg-slate-100 hover:text-ink"
          >
            <X className="size-4" />
          </button>
        )}

        {children}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
