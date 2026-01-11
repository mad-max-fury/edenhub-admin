import { useNavigate } from "react-router-dom";
import { NoAuthFoundImg } from "@/assets/images";
import { Button, Typography } from "@/components";
import ImageWrapper from "../imageLoader/ImageLoader";

export const NoAuthorizationFound = ({
  btnText,
  link,
}: {
  btnText?: string;
  link?: string;
}) => {
  const navigate = useNavigate();

  return (
    <section className="flex h-screen w-screen items-center justify-center">
      <div className="absolute bottom-0 left-0 right-0 top-0 m-[auto] flex h-full w-full flex-col items-center justify-center">
        <ImageWrapper
          src={NoAuthFoundImg}
          alt="401 Image"
          width={500}
          height={500}
        />
        <Typography
          variant="h-xl"
          fontWeight="bold"
          align="center"
          color="N800"
          className="mb-4 block"
        >
          No Authorization Found
        </Typography>
        <Typography
          variant="p-xl"
          fontWeight="regular"
          align="center"
          className="mb-8 block max-w-[34rem]"
        >
          You don&apos;t have permission to view this page. Please log in or
          reach out to your supervisor.
        </Typography>
        <div className="flex items-center justify-center gap-4">
          <Button variant={"secondary"}>Contact Support</Button>
          <Button
            variant={"primary"}
            onClick={() => (link ? navigate(link) : navigate(-1))}
          >
            {btnText ?? "Go Back"}
          </Button>
        </div>
      </div>
    </section>
  );
};
