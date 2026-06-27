"use client";

import React, { useState } from "react";
import {
  useFloating,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  offset,
  flip,
  shift,
  arrow,
  FloatingArrow,
  FloatingPortal,
  autoUpdate,
  safePolygon,
  type Placement,
} from "@floating-ui/react";

export interface TooltipProps {
  /** Content shown inside the tooltip bubble. */
  content?: React.ReactNode;
  /** The element the tooltip is attached to. */
  children: React.ReactNode;
  placement?: Placement;
  /** Delay (ms) before the tooltip opens on hover. */
  delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  delay = 120,
}) => {
  const [open, setOpen] = useState(false);
  const arrowRef = React.useRef<SVGSVGElement>(null);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
  });

  const hover = useHover(context, {
    move: false,
    delay: { open: delay, close: 0 },
    handleClose: safePolygon(),
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  // No content → render the child untouched (so it's safe to wrap anything).
  if (!content) return <>{children}</>;

  return (
    <>
      <span
        ref={refs.setReference}
        {...getReferenceProps()}
        className="inline-flex"
      >
        {children}
      </span>
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="z-[100001] max-w-[240px] rounded-lg bg-N800 px-3 py-2 text-[11px] leading-snug text-white shadow-lg"
            role="tooltip"
          >
            {content}
            <FloatingArrow
              ref={arrowRef}
              context={context}
              className="fill-N800"
            />
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export { Tooltip };
