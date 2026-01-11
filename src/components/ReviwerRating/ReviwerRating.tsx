import { Typography } from "../typography";
import { noImage } from "@/assets/images";

import { FaRegStar } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import ImageWrapper from "../imageLoader/ImageLoader";

interface ReviwerRatingProps {
  comment?: string;
  imageUrl?: string;
  rating?: number;
  name?: string;
}

export const ReviwerRating = ({
  comment,
  imageUrl,
  rating,
  name,
}: ReviwerRatingProps) => {
  const StarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;
    const stars = Array.from({ length: fullStars }, (_, index) => (
      <FaStar key={index} className="w-7 h-7 text-Y200" />
    ));
    const emptyStar = Array.from({ length: emptyStars }, (_, index) => (
      <FaRegStar key={index} className="w-7 h-7 text-Y200" />
    ));
    return (
      <div className="flex items-center gap-2 ">
        {stars}
        {emptyStar}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4  px-4 w-full md:w-[70%] lg:w-[50%] min-h-[400px] my-10">
      <div className="bg-white p-10">
        <Typography
          variant="p-l"
          fontWeight="regular"
          color="N90"
          className="text-base sm:text-xl"
        >
          "{comment}"
        </Typography>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-[90px] h-[90px] overflow-hidden">
          <ImageWrapper
            src={imageUrl || noImage}
            alt="reviewer"
            width={90}
            height={90}
            className="w-full h-full object-cover border "
          />
        </div>
        <div>
          <Typography
            variant="p-l"
            fontWeight="regular"
            color="N90"
            className="text-base sm:text-xl"
          >
            {name}
          </Typography>
          <Typography>{StarRating(rating || 3)}</Typography>
        </div>
      </div>
    </div>
  );
};
