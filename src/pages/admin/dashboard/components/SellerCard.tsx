import { Typography } from "@/components/typography";
import ImageWrapper from "@/components/imageLoader/ImageLoader";

type SellerItemsProps = {
  name: string;
  product: string;
  rate: number;
  image: string;
  isUp?: boolean;
};

const SellerCard = ({ name, product, rate, isUp, image }: SellerItemsProps) => {
  return (
    <div className="flex justify-between  gap-6 w-full">
      <div className="flex gap-2">
        <ImageWrapper
          src={image}
          alt={name}
          width={32}
          height={32}
          className=""
        />

        <div className="flex-1">
          <Typography variant={"p-m"} color={"text-default"}>
            {name}
          </Typography>
          <Typography variant={"p-s"} color={"text-light"}>
            {product}
          </Typography>
        </div>
      </div>

      <span
        className={`text-sm font-medium ${isUp ? "text-G300" : "text-R300"}`}
      >
        {isUp ? "+" : "-"}
        {rate}% {isUp ? "↑" : "↓"}
      </span>
    </div>
  );
};

export default SellerCard;
