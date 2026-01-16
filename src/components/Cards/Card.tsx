import { ArrowUp, ArrowDown } from "lucide-react";
import { Typography } from "../../components/typography";

type CardProps = {
  title: string;
  price: string | number;
  rate: number;
  
  isCurrency?: boolean;
  isUp?: boolean;
  className?: string;
};

export default function Card({
  title,
  price,
  rate,
                   
  isCurrency = false,
  isUp = true,
  className = "",
}: CardProps) {
  // Determine rate color
  const rateColor = rate < 15 ? "R500" : "G500";

  return (
    <div
      className={`
        bg-white border-[0.94px] border-[#E4E4E7] p-6 flex flex-col w- full justify-between
        font-clash
        ${className}
      `}
    >
     
      {/* Title */}
      <Typography
        variant="c-s"
        
        fontWeight="regular"
        color="gray-normal"
        className="mb-2 uppercase"
      >
        {title}
      </Typography>

      {/* Price and Rate */}
      <div className="flex items-center justify-between">
        {/* Price */}
        <Typography
          variant="c-l"
         
          fontWeight="bold"
          color="gray-normal"
        >
          {isCurrency ? `$${price}` : price}
        </Typography>

        {/* Rate with + sign and arrow */}
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
      </div>
    </div>
  );
}
