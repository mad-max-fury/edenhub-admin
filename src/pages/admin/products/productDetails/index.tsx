import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Pencil, Package, Tag } from "lucide-react";

import {
  Badge,
  Button,
  NetworkError,
  Spinner,
  Typography,
} from "@/components";
import {
  useGetProductByIdQuery,
  type IVariant,
} from "@/redux/api/products";
import { ProductAnalytics } from "./components/ProductAnalytics";
import { AuthRouteConfig } from "@/constants/routes";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between py-2 border-b border-N20 last:border-0">
    <Typography variant="p-s" color="N500">
      {label}
    </Typography>
    <Typography variant="p-s" color="N700" fontWeight="medium">
      {value}
    </Typography>
  </div>
);

const VariantCard = ({ variant }: { variant: IVariant }) => {
  const hasDiscount = !!variant.discount?.price && variant.discount.price > 0;
  return (
    <div className="border border-N30 rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Typography variant="p-m" fontWeight="bold">
          {variant.name}
        </Typography>
        <span className="text-xs font-mono text-N500">{variant.sku}</span>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-2">
        <div>
          <Typography variant="c-s" color="N400">
            Price
          </Typography>
          <div className="flex items-center gap-2">
            <Typography variant="p-s" fontWeight="bold">
              {money(hasDiscount ? variant.discount?.price : variant.basePrice)}
            </Typography>
            {hasDiscount && (
              <span className="text-xs text-N400 line-through">
                {money(variant.basePrice)}
              </span>
            )}
          </div>
        </div>
        <div>
          <Typography variant="c-s" color="N400">
            Stock
          </Typography>
          <Typography variant="p-s" color={variant.quantity < 5 ? "R500" : "N700"}>
            {variant.quantity} units
          </Typography>
        </div>
        {variant.tags && variant.tags.length > 0 && (
          <div>
            <Typography variant="c-s" color="N400">
              Tags
            </Typography>
            <Typography variant="p-s" color="N700">
              {variant.tags.join(", ")}
            </Typography>
          </div>
        )}
      </div>
      {variant.images && variant.images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {variant.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="w-12 h-12 rounded object-cover border border-N30"
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, isFetching, error, refetch } =
    useGetProductByIdQuery({ id: id as string }, { skip: !id });

  if (isLoading) {
    return (
      <div className="h-[70vh] w-full">
        <Spinner />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="h-[70vh] w-full">
        <NetworkError isFetching={isFetching} error={error} refetch={refetch} />
      </div>
    );
  }

  const product = data.data;
  const category =
    typeof product.category === "string" ? null : (product.category as any);
  const hasDiscount = !!product.discount?.price && product.discount.price > 0;
  const gallery = [product.coverImage, ...(product.images ?? [])].filter(
    Boolean,
  ) as string[];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-N20 text-N500"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <Typography variant="h-m" fontWeight="bold">
                {product.name}
              </Typography>
              <Badge status={product.status} />
            </div>
            <Typography variant="p-s" color="N500">
              {product.brand || "No brand"}
              {category ? ` · ${category.name}` : ""}
            </Typography>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() =>
            navigate(`${AuthRouteConfig.PRODUCTS}/${product._id}/edit`)
          }
        >
          <div className="flex items-center gap-1.5">
            <Pencil size={14} /> Edit
          </div>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left */}
        <div className="flex flex-col gap-6">
          {/* Gallery */}
          {gallery.length > 0 && (
            <div className="bg-white border border-N30 rounded-xl p-4 flex flex-wrap gap-3">
              {gallery.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  className={`rounded-lg object-cover border border-N30 ${
                    i === 0 ? "w-full h-64" : "w-24 h-24"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Description */}
          <div className="bg-white border border-N30 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-N20 bg-N10/50 flex items-center gap-2">
              <Package size={15} className="text-B400" />
              <Typography variant="h-s" fontWeight="bold">
                Description
              </Typography>
            </div>
            <div className="p-5">
              <Typography variant="p-s" color="N600">
                {product.description}
              </Typography>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white border border-N30 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-N20 bg-N10/50 flex items-center gap-2">
              <Tag size={15} className="text-B400" />
              <Typography variant="h-s" fontWeight="bold">
                Variants ({product.variants?.length ?? 0})
              </Typography>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {product.variants?.length ? (
                product.variants.map((v, i) => <VariantCard key={i} variant={v} />)
              ) : (
                <Typography variant="p-s" color="N400">
                  This product has no variants.
                </Typography>
              )}
            </div>
          </div>

          {/* Per-product analytics */}
          <ProductAnalytics productId={product._id} />
        </div>

        {/* Right */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-N30 rounded-xl p-5">
            <Typography variant="h-s" fontWeight="bold" className="mb-2">
              Pricing
            </Typography>
            <div className="flex items-center gap-2 mb-3">
              <Typography variant="h-m" fontWeight="bold">
                {money(hasDiscount ? product.discount?.price : product.basePrice)}
              </Typography>
              {hasDiscount && (
                <span className="text-sm text-N400 line-through">
                  {money(product.basePrice)}
                </span>
              )}
            </div>
            {hasDiscount && product.discount?.promotionName && (
              <InfoRow label="Promotion" value={product.discount.promotionName} />
            )}
            <InfoRow label="Base stock" value={`${product.quantity} units`} />
            <InfoRow
              label="Returnable"
              value={
                product.isReturnable
                  ? `Yes (${product.returnableDays ?? 0} days)`
                  : "No"
              }
            />
            <InfoRow
              label="Warranty"
              value={
                product.hasWarranty
                  ? `${product.warrantyYears ?? 0} years`
                  : "None"
              }
            />
            {product.weight && <InfoRow label="Weight" value={product.weight} />}
          </div>

          {product.tags?.length > 0 && (
            <div className="bg-white border border-N30 rounded-xl p-5">
              <Typography variant="h-s" fontWeight="bold" className="mb-3">
                Tags
              </Typography>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full bg-B50 text-B400 text-xs font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
