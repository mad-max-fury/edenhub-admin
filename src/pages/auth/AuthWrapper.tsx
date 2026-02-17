import { GoogleIcon } from "@/assets/svgs";
import { Button, Typography } from "@/components";
import ImageWrapper from "@/components/imageLoader/ImageLoader";
import { Link } from "react-router-dom";
import React from "react";

type Props = {
  children: React.ReactNode;
  title: string;
  description: string;
  hideFooter?: boolean;
  hideAuthOptions?: boolean;
  linkText?: string;
  linkSubText?: string;
  linkHref?: string;
  icon?: React.ReactNode;
};

const AuthWrapper = ({
  children,
  title,
  description,
  hideFooter = false,
  linkText,
  linkSubText,
  linkHref,
  hideAuthOptions = false,
  icon,
}: Props) => {
  return (
    <main className="flex justify-center items-center font-inter min-h-screen bg-LB50 py-6">
      <div className="w-full py-[41px] px-[clamp(16px,3vw,40px)] max-w-[550px] bg-white shadow-auth mx-auto rounded-md">
        <header className="flex items-center justify-center flex-col">
          {icon && (
            <div className="mb-4">
              {typeof icon === "string" ? (
                <ImageWrapper
                  src={icon}
                  alt="Auth Icon"
                  width={48}
                  height={48}
                />
              ) : (
                icon
              )}
            </div>
          )}

          <Typography
            variant={"h-l"}
            fontWeight={"medium"}
            color={"gray-darker"}
            className="mb-4"
          >
            {title}
          </Typography>
          <Typography
            variant={"p-m"}
            color={"gray-normal"}
            className="mb-4 max-w-[400px] text-center"
          >
            {description}
          </Typography>
        </header>

        <div className="mx-auto w-full">{children}</div>

        {!hideFooter && (
          <div className="flex flex-col items-center w-full justify-center mx-auto gap-4">
            {!hideAuthOptions && (
              <>
                <div className="w-full flex items-center mb-5 gap-[18px]">
                  <hr className="flex-1 h-[1px] border-none bg-N30" />
                  <span className="text-p-s text-N200"> Or</span>
                  <hr className="flex-1 h-[1px] border-none bg-N30" />
                </div>
                <Button types={"outline"} className="w-full group">
                  <div className="flex text-base items-center gap-4">
                    <GoogleIcon className={`[&>path]:group-hover:fill-white`} />
                    <small className="text-c-m">Continue with Google</small>
                  </div>
                </Button>
              </>
            )}

            {linkText && (
              <Typography
                color="gray-normal"
                variant="p-m"
                className="text-center mt-6 flex gap-1 items-center justify-center"
              >
                {linkText}{" "}
                <Link to={linkHref ?? ""} className="hover:underline">
                  <Typography fontWeight="medium" color={"BR400"}>
                    {linkSubText}
                  </Typography>
                </Link>
              </Typography>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default AuthWrapper;
