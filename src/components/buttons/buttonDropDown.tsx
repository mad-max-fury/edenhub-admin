"use client";

import { useState, useRef } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  type Placement,
} from "@floating-ui/react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/helpers";
import { Typography, type TypographyColors } from "../typography";
import { Button } from "./button";

export type ButtonDropdownItem = {
  name: string;
  icon?: React.ReactNode;
  textColor?: TypographyColors;
  onClick: () => void;
  className?: string;
};

interface ButtonDropdownProps {
  buttonGroup: ButtonDropdownItem[];
  triggerIcon?: React.ReactNode;
  colored?: boolean;
  isLoading?: boolean;
  placement?: Placement;
  className?: string;
}

export const ButtonDropdown = ({
  buttonGroup,
  triggerIcon,
  colored = false,
  isLoading = false,
  placement = "bottom-end",
  className,
}: ButtonDropdownProps) => {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <>
      <Button
        ref={refs.setReference}
        variant="plain"
        disabled={isLoading}
        {...getReferenceProps()}
        className={cn(
          "flex items-center justify-center p-2 border border-N30 rounded-md text-gray-500 hover:bg-N20 transition-all",
          colored && "bg-N20 hover:bg-N700 hover:text-white ",
          open && "bg-N20 border-BR100 text-BR500",
          className,
        )}
      >
        {triggerIcon}
      </Button>

      {open &&
        createPortal(
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-[100] min-w-[180px] overflow-hidden rounded-xl border border-N40 bg-white py-1 shadow-xl animate-in fade-in zoom-in-95 duration-200"
          >
            {buttonGroup.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-N10",
                  item.className,
                )}
              >
                {item.icon && (
                  <span className="text-gray-400">{item.icon}</span>
                )}
                <Typography variant="p-s" color={item.textColor || "N900"}>
                  {item.name}
                </Typography>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
};
