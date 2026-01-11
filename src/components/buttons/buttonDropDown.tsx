"use client";

import { useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  type Placement,
} from "@floating-ui/react";
import { createPortal } from "react-dom";
import { EllipsisIcon } from "@/assets/svgs";
import { cn } from "@/utils/helpers";
import { Typography, type TypographyColors } from "../typography";
import { Button } from "./button";

export type ButtonDropdownItem = {
  name: string;
  textColor?: TypographyColors;
  onClick: () => void;
};

interface ButtonDropdownProps {
  buttonGroup: ButtonDropdownItem[];
  colored?: boolean;
  isLoading?: boolean;
  isVertical?: boolean;
  placement?: Placement;
}

export const ButtonDropdown = ({
  buttonGroup,
  colored = false,
  isLoading = false,
  isVertical = false,
  placement = "bottom-end",
}: ButtonDropdownProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(6), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  return (
    <>
      <Button
        ref={refs.setReference}
        variant="plain"
        disabled={isLoading}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex items-center",
          colored && "rounded bg-N20 p-[12px] hover:bg-N700"
        )}
      >
        <div
          className={cn(
            "transition-transform duration-300",
            isVertical ? "rotate-90" : "rotate-0"
          )}
        >
          <EllipsisIcon />
        </div>
      </Button>

      {open &&
        createPortal(
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-50 w-[191px] rounded border bg-white py-2 shadow-lg"
          >
            {buttonGroup.map((item, index) => (
              <div
                key={index}
                role="menuitem"
                tabIndex={0}
                onClick={() => {
                  item.onClick();
                  setOpen(false);
                }}
                className="cursor-pointer px-4 py-2 hover:bg-N30"
              >
                <Typography variant="p-s" color={item.textColor}>
                  {item.name}
                </Typography>
              </div>
            ))}
          </div>,
          document.getElementById("portal") as HTMLElement
        )}
    </>
  );
};
