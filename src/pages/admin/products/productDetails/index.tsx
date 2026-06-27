import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Pencil,
  Package,
  Tag,
  Layers,
  ArrowRight,
} from "lucide-react";

import {
  Badge,
  Button,
  ImageCarousel,
  Modal,
  NetworkError,
  Spinner,
  Typography,
} from "@/components";
import { useGetProductByIdQuery, type IVariant } from "@/redux/api/products";
import { ProductAnalytics } from "./components/ProductAnalytics";
import { ProductOrders } from "./components/ProductOrders";
import { AuthRouteConfig } from "@/constants/routes";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-4 py-2.5 border-b border-N20 last:border-0">
    <Typography variant="p-s" color="N500">
      {label}
    </Typography>
    <Typography
      variant="p-s"
      color="N700"
      fontWeight="medium"
      className="text-right"
    >
      {value}
    </Typography>
  </div>
);

const Section = ({
  title,
  icon,
  children,
  action,
}: {
  title: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="bg-white border border-N30 rounded-xl overflow-hidden">
    <div className="px-5 py-4 border-b border-N20 bg-N10/50 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <Typography variant="h-s" fontWeight="bold">
          {title}
        </Typography>
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const AttributeList = ({
  attributes,
}: {
  attributes?: Record<string, unknown>;
}) => {
  const entries = Object.entries(attributes ?? {}).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  if (entries.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-x-6">
      {entries.map(([k, v]) => (
        <InfoRow
          key={k}
          label={k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
          value={Array.isArray(v) ? v.join(", ") : String(v)}
        />
      ))}
    </div>
  );
};

// Shared pricing/stock block reused by the product and each variant.
const PriceStockFacts = ({
  basePrice,
  discount,
  quantity,
}: {
  basePrice: number;
  discount?: IVariant["discount"];
  quantity: number;
}) => {
  const hasDiscount = !!discount?.price && discount.price > 0;
  return (
    <>
      <div className="flex items-center gap-2 mb-1">
        <Typography variant="h-m" fontWeight="bold">
          {money(hasDiscount ? discount?.price : basePrice)}
        </Typography>
        {hasDiscount && (
          <span className="text-sm text-N400 line-through">
            {money(basePrice)}
          </span>
        )}
      </div>
      {hasDiscount && discount?.promotionName && (
        <InfoRow label="Promotion" value={discount.promotionName} />
      )}
      <InfoRow
        label="Stock"
        value={
          <span className={quantity < 5 ? "text-R500" : undefined}>
            {quantity} units{quantity < 5 ? " · low" : ""}
          </span>
        }
      />
    </>
  );
};

const VariantDetailModal = ({
  variant,
  onClose,
}: {
  variant: IVariant | null;
  onClose: () => void;
}) => (
  <Modal
    isOpen={!!variant}
    onClose={onClose}
    title={variant?.name ? `Variant · ${variant.name}` : "Variant"}
    mobileLayoutType="normal"
    className="max-w-3xl"
  >
    {variant && (
      <div className="p-6 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
        <ImageCarousel images={variant.images ?? []} alt={variant.name} />
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <Typography variant="p-l" fontWeight="bold">
              {variant.name}
            </Typography>
            {variant.isActive === false ? (
              <Badge status="archived" text="Inactive" />
            ) : (
              <Badge status="active" />
            )}
          </div>
          {variant.sku && (
            <Typography variant="c-s" color="N500" className="font-mono -mt-2">
              SKU: {variant.sku}
            </Typography>
          )}
          <div>
            <PriceStockFacts
              basePrice={variant.basePrice}
              discount={variant.discount}
              quantity={variant.quantity}
            />
          </div>
          {variant.attributes && (
            <AttributeList attributes={variant.attributes} />
          )}
          {variant.tags && variant.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {variant.tags.map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-full bg-BR50 text-BR500 text-xs font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  </Modal>
);

const VariantCard = ({
  variant,
  onView,
}: {
  variant: IVariant;
  onView: () => void;
}) => {
  const hasDiscount = !!variant.discount?.price && variant.discount.price > 0;
  return (
    <div className="border border-N30 rounded-xl p-4 flex gap-4">
      <div className="w-20 h-20 rounded-lg overflow-hidden border border-N30 bg-N10 shrink-0">
        {variant.images?.[0] ? (
          <img
            src={variant.images[0]}
            alt={variant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-N300">
            <Package size={20} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <Typography variant="p-m" fontWeight="bold" className="truncate">
            {variant.name}
          </Typography>
          {variant.sku && (
            <span className="text-xs font-mono text-N500 shrink-0">
              {variant.sku}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Typography variant="p-s" fontWeight="bold">
            {money(hasDiscount ? variant.discount?.price : variant.basePrice)}
          </Typography>
          {hasDiscount && (
            <span className="text-xs text-N400 line-through">
              {money(variant.basePrice)}
            </span>
          )}
          <span className="text-N300">·</span>
          <Typography
            variant="p-s"
            color={variant.quantity < 5 ? "R500" : "N500"}
          >
            {variant.quantity} units
          </Typography>
        </div>
        <button
          onClick={onView}
          className="mt-1 self-start flex items-center gap-1 text-xs font-semibold text-BR400 hover:text-BR500 transition-colors"
        >
          View details <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeVariant, setActiveVariant] = useState<IVariant | null>(null);

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
  const gallery = [product.coverImage, ...(product.images ?? [])].filter(
    Boolean,
  ) as string[];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
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

      {/* Gallery + key facts */}
      <div className="grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-6 items-start">
        <div className="lg:sticky lg:top-4">
          <ImageCarousel images={gallery} alt={product.name} />
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white border border-N30 rounded-xl p-5">
            <Typography variant="h-s" fontWeight="bold" className="mb-3">
              Pricing & stock
            </Typography>
            <PriceStockFacts
              basePrice={product.basePrice}
              discount={product.discount}
              quantity={product.quantity}
            />
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
            <InfoRow
              label="Rating"
              value={`${product.averageRating?.toFixed(1) ?? "0.0"} (${
                product.totalReviews ?? 0
              } reviews)`}
            />
            <InfoRow label="Total sales" value={product.totalSales ?? 0} />
          </div>

          {product.attributes &&
            Object.keys(product.attributes).length > 0 && (
              <Section title="Specifications" icon={<Tag size={15} className="text-BR400" />}>
                <AttributeList attributes={product.attributes} />
              </Section>
            )}

          {product.tags?.length > 0 && (
            <div className="bg-white border border-N30 rounded-xl p-5">
              <Typography variant="h-s" fontWeight="bold" className="mb-3">
                Tags
              </Typography>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full bg-BR50 text-BR500 text-xs font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <Section title="Description" icon={<Package size={15} className="text-BR400" />}>
        <Typography variant="p-s" color="N600">
          {product.description}
        </Typography>
      </Section>

      {/* Variants */}
      <Section
        title={`Variants (${product.variants?.length ?? 0})`}
        icon={<Layers size={15} className="text-BR400" />}
      >
        {product.variants?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.variants.map((v, i) => (
              <VariantCard
                key={v._id ?? i}
                variant={v}
                onView={() => setActiveVariant(v)}
              />
            ))}
          </div>
        ) : (
          <Typography variant="p-s" color="N400">
            This product has no variants.
          </Typography>
        )}
      </Section>

      {/* Per-product analytics */}
      <ProductAnalytics productId={product._id} />

      {/* Orders containing this product */}
      <ProductOrders productId={product._id} />

      <VariantDetailModal
        variant={activeVariant}
        onClose={() => setActiveVariant(null)}
      />
    </div>
  );
};

export default ProductDetails;
