"use client";

import React from "react";
import { cn } from "@/utils/helpers";
import { cva, type VariantProps } from "class-variance-authority";
import { Typography } from "../typography";
import { Tooltip } from "../tooltip/Tooltip";

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
  "not subscribed": "red",
  subscribed: "green",
  shipped: "blue",
  delivered: "green",
  unfulfilled: "purple",
  processing: "purple",
  "in progress": "blue",
  "partially fulfilled": "teal",
  active: "green",
  archived: "yellow",
  cancelled: "red",
  draft: "gray",
  drafted: "gray",
  low: "blue",
  medium: "yellow",
  high: "red",
};

// Plain-language explanation of each status, surfaced as a tooltip so admins
// understand exactly what a badge means without guessing.
const statusToDescription: Record<string, string> = {
  // Payment
  paid: "Payment received and confirmed.",
  pending: "Awaiting payment — the customer hasn't completed checkout yet.",
  failed: "Payment failed or was abandoned. The order was cancelled and stock restored.",
  refunded: "The customer's payment has been refunded.",
  "awaiting payment": "Awaiting payment from the customer.",
  // Order status
  processing: "Paid and being prepared — awaiting fulfillment.",
  completed: "Fully paid, delivered, and closed.",
  cancelled: "This order was cancelled. It can no longer be fulfilled.",
  // Fulfillment
  unfulfilled: "Not yet shipped — awaiting fulfillment.",
  "partially fulfilled": "Some items have shipped; others are still pending.",
  shipped: "Handed to the courier and on its way to the customer.",
  delivered: "Received by the customer.",
  returned: "The goods were sent back (cancelled or returned after dispatch).",
  // Misc
  "in progress": "Currently in progress.",
  active: "Active and live.",
  archived: "Archived — hidden from active listings.",
  draft: "Draft — not yet published.",
  drafted: "Draft — not yet published.",
  subscribed: "Subscription is active.",
  "not subscribed": "No active subscription.",
  low: "Low priority.",
  medium: "Medium priority.",
  high: "High priority.",
};

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  text?: string;
  status?: string;
  showDot?: boolean;
  /** Override the auto tooltip description. Pass `null` to disable it. */
  tooltip?: React.ReactNode | null;
}

const Badge: React.FC<BadgeProps> = ({
  className,
  variant: variantProp,
  status,
  text,
  showDot = true,
  tooltip,
  ...props
}) => {
  const derivedVariant =
    variantProp ||
    (status ? statusToVariant[status.toLowerCase()] : "blue") ||
    "blue";

  const displayText = text || status || derivedVariant;

  // tooltip prop wins; `null` disables; otherwise auto-describe from status.
  const description =
    tooltip === null
      ? null
      : tooltip ??
        (status ? statusToDescription[status.toLowerCase()] : undefined);

  return (
    <Tooltip content={description}>
      <span
        className={cn(badgeVariants({ variant: derivedVariant }), className)}
        {...props}
      >
        {showDot && (
          <span className={dotVariants({ variant: derivedVariant })} />
        )}
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
    </Tooltip>
  );
};

export { Badge, badgeVariants };
