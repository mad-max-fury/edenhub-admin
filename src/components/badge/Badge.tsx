"use client";

import React from "react";
import { cn } from "@/utils/helpers";
import { cva, type VariantProps } from "class-variance-authority";
import { Typography } from "../typography";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-[7px] border",
  {
    variants: {
      variant: {
        blue: "bg-B50 border-B100 text-B500",
        red: "bg-R50 border-R100 text-R500",
        yellow: "bg-Y50 border-Y100 text-Y500",
        green: "bg-G50 border-G100 text-G500",
        purple: "bg-P50 border-P100 text-P500",
        teal: "bg-T50 border-T100 text-T500",
        gray: "bg-N20 border-N40 text-N500",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  },
);

const dotVariants = cva("w-1.5 h-1.5 rounded-full", {
  variants: {
    variant: {
      blue: "bg-B300",
      red: "bg-R300",
      yellow: "bg-Y300",
      green: "bg-G300",
      purple: "bg-P300",
      teal: "bg-T300",
      gray: "bg-N100",
    },
  },
  defaultVariants: {
    variant: "blue",
  },
});

const statusToVariant: Record<
  string,
  NonNullable<VariantProps<typeof badgeVariants>["variant"]>
> = {
  paid: "green",
  pending: "yellow",
  failed: "red",
  refunded: "red",
  "awaiting payment": "yellow",

  shipped: "blue",
  delivered: "green",
  unfulfilled: "purple",
  processing: "purple",
  "in progress": "blue",
  "partially fulfilled": "teal",

  active: "green",
  cancelled: "red",
  draft: "gray",
};

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  text?: string;
  status?: string;
  showDot?: boolean;
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant: variantProp,
  status,
  text,
  showDot = true,
  ...props
}) => {
  const derivedVariant =
    variantProp ||
    (status ? statusToVariant[status.toLowerCase()] : "blue") ||
    "blue";

  const displayText = text || status || derivedVariant;

  return (
    <span
      className={cn(badgeVariants({ variant: derivedVariant }), className)}
      {...props}
    >
      {showDot && <span className={dotVariants({ variant: derivedVariant })} />}
      <Typography
        variant="p-s"
        noWrap
        fontWeight="medium"
        className="text-[11px] leading-none capitalize"
        style={{ color: "inherit" }}
      >
        {displayText}
      </Typography>
    </span>
  );
};

export { Badge, badgeVariants };
