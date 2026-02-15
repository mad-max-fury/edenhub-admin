import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

import { Button } from "../buttons";
import { cn } from "@/utils/helpers";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  anchor?: "right" | "left";
  onAction?: () => void;
  onSecondaryAction?: () => void;
  isFooter?: boolean;
  actionText?: string;
  secondaryActionText?: string;
  loading?: boolean;
  selector: string;
  header?: React.ReactNode;
  width?: string;
  className?: string;
  bodyClassNames?: string;
  rootClassName?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onClose,
  children,
  anchor = "right",
  isFooter,
  onAction,
  onSecondaryAction,
  actionText,
  secondaryActionText,
  loading,
  selector,
  header,
  width = "256px",
  className,
  bodyClassNames,
  rootClassName,
}) => {
  const portalRef = useRef<Element | null>(null);

  useEffect(() => {
    portalRef.current = document.getElementById(selector);
  }, [selector]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = () => {
    document.body.style.overflow = "";
    onClose();
  };

  return (
    <>
      {portalRef.current &&
        ReactDOM.createPortal(
          <div className={cn("app-drawer-root z-[1000]", rootClassName)}>
            <div
              onClick={handleClose}
              className={`fixed inset-0 z-50 bg-[#091E428A] transition-opacity duration-200 ${
                open ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            />
            <div
              className={cn(
                `fixed top-0 flex h-full w-full flex-col transition-transform duration-300 ${
                  anchor === "right" ? "right-0" : "left-0"
                } ${
                  open
                    ? "translate-x-0"
                    : anchor === "right"
                      ? "translate-x-full"
                      : "-translate-x-full"
                } z-50 bg-white`,
                className,
              )}
              style={{ maxWidth: width }}
            >
              {header && <div className="p-4">{header}</div>}
              <div
                className={cn(
                  "flex-1 flex-grow overflow-auto p-4 hideScrollBar",
                  bodyClassNames,
                )}
              >
                {children}
              </div>
              {isFooter && (
                <div className="w-full p-4">
                  <div className="flex justify-end gap-4">
                    {secondaryActionText && (
                      <Button
                        onClick={() => {
                          if (!loading && onSecondaryAction)
                            onSecondaryAction();
                        }}
                      >
                        {secondaryActionText}
                      </Button>
                    )}
                    {actionText && (
                      <Button
                        onClick={() => {
                          if (!loading && onAction) onAction();
                        }}
                      >
                        {actionText}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>,
          portalRef.current,
        )}
    </>
  );
};
