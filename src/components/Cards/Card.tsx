import { ArrowUp, ArrowDown } from "lucide-react";
import { Typography } from "../../components/typography";

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
  const rateColor = rate < 15 ? "R300" : "G300";

  if (children) {
    return (
      <div
        className={`bg-white border-[0.94px] border-gray-200 p-[14px] flex flex-col w-full justify-between font-clashDisplay ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={`bg-white border-[0.94px] border-gray-200 p-[14px_24px] gap-4 flex flex-col w-full justify-between font-clashDisplay ${className}`}
    >
      {title && (
        <Typography
          variant="c-s"
          fontWeight="regular"
          color="G500"
          className="mb-2 uppercase"
        >
          {title}
        </Typography>
      )}

      <div className="flex items-center justify-between">
        {price !== undefined && (
          <Typography variant="c-l" fontWeight="bold" color={"text-default"}>
            {isCurrency ? `$${price}` : price}
          </Typography>
        )}

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
              <ArrowUp className={`w-4 h-4 ml-1 text-${rateColor}`} />
            ) : (
              <ArrowDown className={`w-4 h-4 ml-1 text-${rateColor}`} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
