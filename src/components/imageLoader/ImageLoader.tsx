import { cn } from "@/utils/helpers";
import { useState } from "react";

interface ImageWrapperProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  fill?: boolean;
  placeholder?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

const ImageWrapper = ({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  placeholder,
  errorFallback,
  ...props
}: ImageWrapperProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden ",
        fill ? "absolute inset-0 h-full w-full" : "block",
        className
      )}
      style={{
        aspectRatio: !fill && width && height ? `${width} / ${height}` : "auto",
        width: !fill && width ? width : undefined,
        height: !fill && height ? height : undefined,
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-N40 animate-pulse">
          {placeholder ? (
            placeholder
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 bg-N60 rounded-full opacity-50" />
            </div>
          )}
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-R50 text-R500 p-2">
          {errorFallback ? (
            errorFallback
          ) : (
            <span className="text-c-s font-bold">Failed to load</span>
          )}
        </div>
      )}

      {!hasError && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={cn(
            "duration-500 ease-in-out w-full h-full",
            fill ? "object-cover" : "",
            isLoading
              ? "scale-105 blur-sm grayscale opacity-0"
              : "scale-100 blur-0 grayscale-0 opacity-100"
          )}
          {...props}
        />
      )}
    </div>
  );
};

export default ImageWrapper;
