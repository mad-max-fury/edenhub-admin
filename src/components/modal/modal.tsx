"use client";

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
  mobileLayoutType: "full" | "normal" | "drawer";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footerData,
  mobileLayoutType,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Overlay with a blur effect for premium feel */}
        <Dialog.Overlay className="fixed inset-0 z-[99] bg-[#091E428A] backdrop-blur-[2px] data-[state=open]:animate-fadeIn" />

        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-[100] w-[95%] max-w-[744px] -translate-x-1/2 -translate-y-1/2 bg-N0 shadow-2xl transition-all duration-300",
            "data-[state=open]:animate-scaleIn focus:outline-none",

            mobileLayoutType === "normal" && "",
            mobileLayoutType === "full" &&
              "h-screen w-screen sm:h-auto sm:w-[95%] ",

            mobileLayoutType === "drawer" && [
              "max-w-sm:!top-[unset] max-w-sm:!-translate-y-[unset] max-w-sm:bottom-0 max-w-sm:left-0 max-w-sm:translate-x-0 max-w-sm:translate-y-0",
              "max-w-sm:w-full max-w-sm:max-w-none max-w-sm:rounded-t-[24px] max-w-sm:rounded-b-none",
              "max-w-sm:animate-slideUp",
            ],
            className,
          )}
        >
          {mobileLayoutType === "drawer" && (
            <div
              onClick={onClose}
              className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-N40 sm:hidden"
            />
          )}

          {title && (
            <div className="flex items-center justify-between border-b border-N40 px-6 py-4">
              <Typography variant="p-l" fontWeight="bold">
                {title}
              </Typography>

              <Dialog.Close asChild>
                <Button
                  variant="plain"
                  size="plain"
                  className="hover:bg-N20  rounded-full p-1"
                >
                  <CloseIcon size={20} className="text-N600" />
                </Button>
              </Dialog.Close>
            </div>
          )}

          <div
            className={cn(
              "max-h-[80vh] overflow-y-auto custom-scrollbar",
              !title && "pt-2",
            )}
          >
            {children}
          </div>

          {footerData && (
            <div className="border-t border-N40 px-6 py-4">{footerData}</div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
