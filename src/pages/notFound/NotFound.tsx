import { useNavigate } from "react-router-dom";
import { NotFoundImg } from "@/assets/images";
import { Button, Typography } from "@/components";
import ImageWrapper from "@/components/imageLoader/ImageLoader";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <section className="flex h-full  items-center justify-center">
      <div className=" m-[auto] flex h-full w-full flex-col items-center justify-center">
        <ImageWrapper
          src={NotFoundImg}
          alt="404 Image"
          className=" h-[300px] aspect-video"
        />

        <Typography
          variant="h-l"
          fontWeight="bold"
          align="center"
          className="mb-4 block text-[#0A0F2D]"
        >
          Oops! Page Not Found
        </Typography>

        <Typography
          variant="h-m"
          fontWeight="regular"
          align="center"
          className="mb-8 block text-[#2F3A4F] mmd:font-light mxxs:font-extralight"
        >
          We&apos;re sorry, but the page you are looking for doesn&apos;t exist.
        </Typography>

        <Button variant={"brown-light"} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </section>
  );
};

export default NotFound;
