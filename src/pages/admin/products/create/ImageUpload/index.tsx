import { useRef } from "react";
import { ImagePlus, X, Camera } from "lucide-react";
import type { ProductPicture } from "../types";

interface CoverUploadProps {
  image?: ProductPicture;
  onAdd: (file: File) => void;
  onRemove: () => void;
  error?: string;
}

export const CoverUpload = ({
  image,
  onAdd,
  onRemove,
  error,
}: CoverUploadProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="relative w-full rounded-xl overflow-hidden"
        style={{ height: 260 }}
      >
        {image?.preview ? (
          <>
            <img
              src={image.preview}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-colors"
            >
              <X size={14} className="text-N700" />
            </button>
            <button
              type="button"
              onClick={() => ref.current?.click()}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-sm text-xs font-semibold text-N700 shadow hover:bg-white transition-colors"
            >
              <Camera size={12} />
              Change
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className={`w-full h-full flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl transition-all duration-150
              ${error ? "border-R300 bg-R50/30" : "border-N40 bg-N10 hover:border-B200 hover:bg-B50/30"}`}
          >
            <div className="w-14 h-14 rounded-2xl bg-white border border-N30 shadow-sm flex items-center justify-center">
              <ImagePlus
                size={24}
                className={error ? "text-R400" : "text-N300"}
              />
            </div>
            <div className="text-center">
              <p
                className={`text-sm font-semibold ${error ? "text-R400" : "text-N500"}`}
              >
                Upload cover image
              </p>
              <p className="text-xs text-N300 mt-0.5">
                PNG, JPG, WEBP · Max 5MB
              </p>
            </div>
          </button>
        )}
      </div>
      {error && <p className="text-xs text-R400">{error}</p>}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onAdd(file);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
};

// ─── Thumbnail grid ───────────────────────────────────────────────────────────
interface ThumbnailGridProps {
  images: ProductPicture[];
  onAdd: (file: File) => void;
  onRemove: (index: number) => void;
  max?: number;
  label?: string;
}

export const ThumbnailGrid = ({
  images,
  onAdd,
  onRemove,
  max = 5,
  label,
}: ThumbnailGridProps) => {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <p className="text-xs font-medium text-N500 uppercase tracking-wide">
          {label}
        </p>
      )}
      <div className="flex flex-wrap gap-2.5">
        {images.map((img, idx) => (
          <div
            key={img.id}
            className="relative w-[72px] h-[72px] rounded-lg border border-N30 overflow-hidden bg-N10 group shrink-0"
          >
            {img.preview ? (
              <img
                src={img.preview}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImagePlus size={18} className="text-N200" />
              </div>
            )}
            <button
              type="button"
              onClick={() => onRemove(idx)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        ))}
        {images.length < max && (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="w-[72px] h-[72px] rounded-lg border-2 border-dashed border-N40 hover:border-B200 hover:bg-B50/50 flex flex-col items-center justify-center gap-1 transition-all duration-150 shrink-0"
          >
            <ImagePlus size={18} className="text-N300" />
            <span className="text-[10px] font-medium text-N400">Add</span>
          </button>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onAdd(file);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
};
