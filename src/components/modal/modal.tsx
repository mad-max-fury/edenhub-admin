import * as Dialog from "@radix-ui/react-dialog";
import { X as CloseIcon } from "lucide-react";
import { cn } from "@/utils/helpers";
import { Typography } from "../typography";
import { Button } from "../buttons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footerData?: React.ReactNode;
  mobileLayoutType: "full" | "normal";
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footerData,
  mobileLayoutType,
}: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[99] bg-[#091E428A] data-[state=open]:animate-fadeIn" />

        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-[100] w-full max-w-[744px] -translate-x-1/2 -translate-y-1/2 bg-N0 shadow-xl",
            "data-[state=open]:animate-scaleIn",
            mobileLayoutType === "normal" ? "rounded-md" : "h-screen"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-N40 px-6 py-4">
            <Typography variant="p-l">{title}</Typography>

            <Dialog.Close asChild>
              <Button variant="plain" size="plain">
                <CloseIcon />
              </Button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="max-h-[70vh] overflow-y-auto">{children}</div>

          {/* Footer */}
          {footerData && (
            <div className="border-t border-N40 px-6 py-4">{footerData}</div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
