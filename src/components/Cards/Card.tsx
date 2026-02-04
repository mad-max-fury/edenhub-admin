import { ArrowUp, ArrowDown } from "lucide-react";
import { Typography } from "../../components/typography";
import React from "react";
import type { ReactNode } from "react";


type CardProps = {
  title?: string;
  price?: string | number;
  rate?: number;
  isCurrency?: boolean;
  isUp?: boolean;
  className?: string;
  children?: ReactNode; 
};

export default function Card({
  title,
  price,
  rate = 0,
  isCurrency = false,
  isUp = true,
  className = "",
  children,
}: CardProps) {
  // Determine rate color
  const rateColor = rate < 15 ? "R500" : "G500";

  // If children are provided, render them instead of the default card
  if (children) {
    return (
      <div
        className={`bg-white border-[0.94px] border-[#E4E4E7] p-6 flex flex-col w-full justify-between font-clashDisplay ${className}`}
      >
        {children}
      </div>
    );
  }

  // Default metric card
  return (
    <div
      className={`bg-white border-[0.94px] border-[#E4E4E7] p-6 flex flex-col w-full justify-between font-clashDisplay ${className}`}
    >
      {/* Title */}
      {title && (
        <Typography
          variant="c-s"
          fontWeight="regular"
          color="gray-normal"
          className="mb-2 uppercase"
        >
          {title}
        </Typography>
      )}

      {/* Price and Rate */}
      <div className="flex items-center justify-between">
        {/* Price */}
        {price !== undefined && (
          <Typography variant="c-l" fontWeight="bold" color="gray-normal">
            {isCurrency ? `$${price}` : price}
          </Typography>
        )}

        {/* Rate */}
        {rate !== undefined && (
          <div className="flex items-center text-[inherit]">
            <Typography
              variant="c-s"
              fontWeight="bold"
              color={rateColor}
              className="flex items-center"
            >
              +{rate}%
            </Typography>
            {isUp ? (
              <ArrowUp className={`w-4 h-4 ml-1 ${rateColor}`} />
            ) : (
              <ArrowDown className={`w-4 h-4 ml-1 ${rateColor}`} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
