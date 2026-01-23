import { ArrowUp, ArrowDown } from "lucide-react";
import { Typography } from "@/components/typography";




type SellerItemsProps = {
  name: string;
  product: string;
  rate: number;
  image: string;
  isUp?: boolean;
};


export default function SellerCard({
  name,
  product,
  rate,
  image,
  isUp = true,
}: SellerItemsProps) {
  const isLow = rate < 15;
  const rateColor = isLow ? "text-R500" : "text-G500";
  

  return (
    <div className="flex items-center justify-center gap-4 bg-white  p-4 ">
      
      {/* Image */}
      <img
        src={image}
        alt={name}
        className="w-12 h-12  object-cover"
      />

      {/* Info */}
      <div className="flex-1 ">
        <Typography
          variant="c-s"
          
          fontWeight="bold"
          color="gray-normal"
        >
          {name}
        </Typography>

        <Typography
          variant="c-s"
          
          fontWeight="regular"
          color="N500"
          className="my-2"
        >
           {product}
        </Typography>
      </div>

      {/* Rate */}
      <div className={`flex items-center font-bold ${rateColor}`}>
        <span className="text-sm">+{rate}%</span>
        {isUp ? (
          <ArrowUp className="w-4 h-4 ml-1" />
        ) : (
          <ArrowDown className="w-4 h-4 ml-1" />
        )}
      </div>
    </div>
  );
}
