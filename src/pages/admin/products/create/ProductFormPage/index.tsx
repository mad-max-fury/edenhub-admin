import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useForm,
  FormProvider,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { notify, Button, TextField, Typography } from "@/components";
import { getErrorMessage } from "@/utils/getErrorMessges";
import { useUploadMutation } from "@/redux/api/resources";
import {
  useCreateProductMutation,
  useUpdateProductByIdMutation,
  useGetProductByIdQuery,
  type ICreateProduct,
} from "@/redux/api/products";
import {
  Package,
  DollarSign,
  ShieldCheck,
  Layers,
  Tag,
  ChevronLeft,
  Plus,
  Info,
  PenLine,
  Globe,
  Users,
  Clock,
  Video,
} from "lucide-react";

import type {
  ProductFormData,
  IVariant,
  ProductPicture,
  ISelectItem,
  ICategory,
  ICategoryAttribute,
} from "../types";
import { buildProductSchema } from "../schema";
import { TAG_SUGGESTIONS } from "../mockData";
import {
  useGetCategoryTreeQuery,
  type ICategory as IApiCategory,
  type ICategoryAttribute as IApiCategoryAttribute,
} from "@/redux/api/categories";
import {
  FormField,
  FormTextarea,
  YesNoToggle,
  FormSection,
} from "../FormPrimitives";
import { CoverUpload, ThumbnailGrid } from "../ImageUpload";
import AttributeRenderer from "../AttributeRenderer";
import VariantForm from "../VariantForm";
import TagSelect, { SingleSelect } from "../TagSelect";

interface Props {
  isEdit?: boolean;
}

// ─── Discount row ─────────────────────────────────────────────────────────────
const DiscountRow = ({
  pct,
  price,
  base,
  disabled,
  onPct,
  onPrice,
}: {
  pct: number;
  price: number;
  base: number;
  disabled: boolean;
  onPct: (v: number) => void;
  onPrice: (v: number) => void;
}) => (
  <div
    className={`grid grid-cols-2 gap-4 transition-opacity ${disabled ? "opacity-40 pointer-events-none" : ""}`}
  >
    <TextField
      label="Discount %"
      name="discountPercentageControl"
      type="number"
      min={0}
      max={100}
      disabled={disabled}
      value={pct}
      onChange={(e) => onPct(Number(e.target.value))}
    />
    <TextField
      label="Discounted Price (₦)"
      name="discountedPriceControl"
      type="number"
      min={0}
      max={base}
      disabled={disabled}
      value={price}
      onChange={(e) => onPrice(Number(e.target.value))}
    />
  </div>
);

const mapAttribute = (attr: IApiCategoryAttribute): ICategoryAttribute => ({
  id: attr._id ?? attr.name,
  name: attr.name,
  inputType: attr.inputType,
  isRequired: attr.isRequired,
  order: attr.order,
  options: attr.options ?? [],
});

const flattenCategories = (
  nodes: IApiCategory[],
  inherited: ICategoryAttribute[] = [],
  depth = 0,
): ICategory[] => {
  const out: ICategory[] = [];
  for (const node of nodes) {
    const merged = [...inherited, ...(node.attributes ?? []).map(mapAttribute)];
    out.push({
      id: node._id,
      name: `${"— ".repeat(depth)}${node.name}`.trim(),
      attributes: merged,
    });
    if (node.subcategories?.length) {
      out.push(...flattenCategories(node.subcategories, merged, depth + 1));
    }
  }
  return out;
};

const ProductFormPage = ({ isEdit = false }: Props) => {
  const navigate = useNavigate();
  const { id: productId } = useParams<{ id: string }>();
  const editing = isEdit || !!productId;
  const [saving, setSaving] = useState(false);
  const [showOptionalAttrs, setShowOptionalAttrs] = useState(false);

  const [uploadFile] = useUploadMutation();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductByIdMutation();
  const { data: existingProduct } = useGetProductByIdQuery(
    { id: productId as string },
    { skip: !productId },
  );

  const { data: categoryTree } = useGetCategoryTreeQuery();
  const categories = useMemo(
    () => flattenCategories(categoryTree?.data ?? []),
    [categoryTree],
  );

  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const activeCategory = categories.find((c) => c.id === activeCategoryId);
  const categoryAttrs = activeCategory?.attributes ?? [];
  const requiredAttrs = categoryAttrs
    .filter((a) => a.isRequired)
    .sort((a, b) => a.order - b.order);
  const optionalAttrs = categoryAttrs
    .filter((a) => !a.isRequired)
    .sort((a, b) => a.order - b.order);

  const categoryOptions: ISelectItem[] = categories.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const schema = useMemo(
    () => buildProductSchema(categoryAttrs),
    [categoryAttrs],
  );

  const methods = useForm<ProductFormData>({
    mode: "onChange",
    resolver: yupResolver(schema) as any,
    defaultValues: {
      productName: "",
      brand: "",
      description: "",
      basePrice: 0,
      discountPercentage: 0,
      discountedPrice: 0,
      discountStartDate: "",
      discountEndDate: "",
      promotionName: "",
      isReturnable: false,
      hasWarranty: false,
      engravingAvailable: false,
      engravingFee: 0,
      engravingMaxCharacters: 20,
      engravingMaxLines: 1,
      engravingFonts: "",
      weight: "",
      tags: [],
      category: { label: "", value: "" },
      quantity: 0,
      pictures: [],
      attributes: {},
      variants: [],
      metaTitle: "",
      metaDescription: "",
      audience: "",
      videoUrls: "",
      lowStockThreshold: 5,
      scheduledPublishAt: "",
      variationGroup: "",
      variationLabel: "",
      variationValue: "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const product = existingProduct?.data;
    if (!product) return;

    const cat =
      typeof product.category === "string"
        ? { _id: product.category, name: "" }
        : (product.category as { _id: string; name: string });

    setActiveCategoryId(cat._id);
    reset({
      productName: product.name,
      brand: product.brand ?? "",
      description: product.description,
      basePrice: product.basePrice,
      discountPercentage: product.discount?.percentage ?? 0,
      discountedPrice: product.discount?.price ?? 0,
      discountStartDate: product.discount?.startDate?.slice(0, 10) ?? "",
      discountEndDate: product.discount?.endDate?.slice(0, 10) ?? "",
      promotionName: product.discount?.promotionName ?? "",
      isReturnable: product.isReturnable,
      returnableDays: product.returnableDays,
      hasWarranty: product.hasWarranty,
      warrantyYears: product.warrantyYears,
      engravingAvailable: product.engraving?.available ?? false,
      engravingFee: product.engraving?.fee ?? 0,
      engravingMaxCharacters: product.engraving?.maxCharacters ?? 20,
      engravingMaxLines: product.engraving?.maxLines ?? 1,
      engravingFonts: (product.engraving?.fonts ?? []).join(", "),
      weight: product.weight ?? "",
      tags: (product.tags ?? []).map((t) => ({ label: t, value: t })),
      category: { label: cat.name, value: cat._id },
      quantity: product.quantity,
      coverImage: product.coverImage
        ? { id: "cover", preview: product.coverImage }
        : undefined,
      pictures: (product.images ?? []).map((url, i) => ({
        id: `img-${i}`,
        preview: url,
      })),
      attributes: (product.attributes as Record<string, string>) ?? {},
      variants: (product.variants ?? []).map((v) => ({
        name: v.name,
        basePrice: v.basePrice,
        discountPercentage: v.discount?.percentage,
        discountedPrice: v.discount?.price,
        discountStartDate: v.discount?.startDate?.slice(0, 10),
        discountEndDate: v.discount?.endDate?.slice(0, 10),
        promotionName: v.discount?.promotionName,
        quantity: v.quantity,
        pictures: (v.images ?? []).map((url, i) => ({
          id: `v-${i}`,
          preview: url,
        })),
        attributes: (v.attributes as Record<string, string>) ?? {},
        tags: (v.tags ?? []).map((t) => ({ label: t, value: t })),
      })),
      metaTitle: product.metaTitle ?? "",
      metaDescription: product.metaDescription ?? "",
      audience: product.audience ?? "",
      videoUrls: (product.videos ?? []).join(", "),
      lowStockThreshold: product.lowStockThreshold ?? 5,
      scheduledPublishAt: product.scheduledPublishAt?.slice(0, 16) ?? "",
      variationGroup: product.variationGroup ?? "",
      variationLabel: product.variationLabel ?? "",
      variationValue: product.variationValue ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingProduct]);
  const watched = watch();
  const basePrice = watched.basePrice ?? 0;
  const discountDisabled = !basePrice || basePrice <= 0;

  const syncPct = (pct: number) => {
    const c = Math.min(Math.max(0, pct), 100);
    setValue("discountPercentage", c, { shouldValidate: true });
    setValue(
      "discountedPrice",
      c > 0 ? Math.round(basePrice - (basePrice * c) / 100) : 0,
    );
  };
  const syncPrice = (price: number) => {
    const c = Math.min(Math.max(0, price), basePrice);
    setValue("discountedPrice", c, { shouldValidate: true });
    setValue(
      "discountPercentage",
      c > 0 ? Math.round(((basePrice - c) / basePrice) * 100) : 0,
    );
  };

  const {
    fields: picFields,
    append: appendPic,
    remove: removePic,
  } = useFieldArray({ control, name: "pictures" });

  const {
    fields: variants,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variants" });

  const coverImg = watch("coverImage");

  const addCover = (file: File) =>
    setValue("coverImage", {
      id: `cover-${Date.now()}`,
      file,
      preview: URL.createObjectURL(file),
    });
  const removeCover = () => {
    if (coverImg?.preview?.startsWith("blob:"))
      URL.revokeObjectURL(coverImg.preview);
    setValue("coverImage", undefined);
  };

  const addPic = (file: File) =>
    appendPic({
      id: `pic-${Date.now()}`,
      file,
      preview: URL.createObjectURL(file),
    });
  const rmPic = (i: number) => {
    const p = picFields[i] as unknown as ProductPicture;
    if (p?.preview?.startsWith("blob:")) URL.revokeObjectURL(p.preview);
    removePic(i);
  };

  const addVariant = () =>
    appendVariant({
      name: "",
      basePrice: 0,
      quantity: 0,
      pictures: [],
      attributes: {},
      tags: [],
    } as unknown as IVariant);

  const resolvePicture = async (
    pic?: ProductPicture,
  ): Promise<string | undefined> => {
    if (!pic) return undefined;
    if (pic.file) {
      const res = await uploadFile({
        file: pic.file,
        params: { type: "products" },
      }).unwrap();
      return res.data.url;
    }
    return pic.preview?.startsWith("blob:") ? undefined : pic.preview;
  };

  const resolvePictures = async (pics: ProductPicture[] = []) => {
    const urls = await Promise.all(pics.map((p) => resolvePicture(p)));
    return urls.filter((u): u is string => !!u);
  };

  const buildDiscount = (
    pct?: number,
    price?: number,
    startDate?: string,
    endDate?: string,
    promotionName?: string,
  ) =>
    price && price > 0
      ? {
          percentage: pct || 0,
          price,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          promotionName: promotionName || undefined,
        }
      : undefined;

  const onSubmit = async (data: ProductFormData) => {
    setSaving(true);
    try {
      const [coverImage, gallery] = await Promise.all([
        resolvePicture(data.coverImage),
        resolvePictures(data.pictures),
      ]);

      const variants = await Promise.all(
        (data.variants ?? []).map(async (v) => ({
          name: v.name,
          basePrice: v.basePrice,
          quantity: v.quantity,
          discount: buildDiscount(
            v.discountPercentage,
            v.discountedPrice,
            v.discountStartDate,
            v.discountEndDate,
            v.promotionName,
          ),
          attributes: v.attributes ?? {},
          tags: (v.tags ?? []).map((t) => t.value),
          images: await resolvePictures(v.pictures),
        })),
      );

      const payload: ICreateProduct = {
        name: data.productName,
        description: data.description,
        brand: data.brand || undefined,
        category: data.category.value,
        basePrice: data.basePrice,
        discount: buildDiscount(
          data.discountPercentage,
          data.discountedPrice,
          data.discountStartDate,
          data.discountEndDate,
          data.promotionName,
        ),
        quantity: data.quantity,
        attributes: data.attributes ?? {},
        tags: (data.tags ?? []).map((t) => t.value),
        coverImage,
        images: gallery,
        weight: data.weight || undefined,
        isReturnable: data.isReturnable,
        returnableDays: data.isReturnable ? data.returnableDays : undefined,
        hasWarranty: data.hasWarranty,
        warrantyYears: data.hasWarranty ? data.warrantyYears : undefined,
        engraving: {
          available: data.engravingAvailable,
          fee: data.engravingAvailable ? data.engravingFee ?? 0 : 0,
          maxCharacters: data.engravingAvailable
            ? data.engravingMaxCharacters ?? 20
            : 20,
          maxLines: data.engravingAvailable ? data.engravingMaxLines ?? 1 : 1,
          fonts: data.engravingAvailable
            ? (data.engravingFonts ?? "")
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean)
            : [],
        },
        variants,
        status: "active",
        metaTitle: data.metaTitle || undefined,
        metaDescription: data.metaDescription || undefined,
        audience: (data.audience as "men" | "women" | "unisex") || undefined,
        videos: data.videoUrls
          ? data.videoUrls.split(",").map((u: string) => u.trim()).filter(Boolean)
          : undefined,
        lowStockThreshold: data.lowStockThreshold ?? 5,
        scheduledPublishAt: data.scheduledPublishAt || undefined,
        variationGroup: data.variationGroup || undefined,
        variationLabel: data.variationLabel || undefined,
        variationValue: data.variationValue || undefined,
      };

      if (editing && productId) {
        await updateProduct({ id: productId, ...payload }).unwrap();
        notify.success({
          message: "Product updated",
          subtitle: `${data.productName} has been saved`,
        });
      } else {
        await createProduct(payload).unwrap();
        notify.success({
          message: "Product created",
          subtitle: `${data.productName} is now in your catalog`,
        });
      }
      navigate(-1);
    } catch (err) {
      notify.error({
        message: "Could not save product",
        subtitle: getErrorMessage(err),
      });
    } finally {
      setSaving(false);
    }
  };

  const totalStock =
    (watched.quantity ?? 0) +
    (watched.variants ?? []).reduce((s, v) => s + (v.quantity ?? 0), 0);

  return (
    <FormProvider {...methods}>
      <div className="sticky top-0 z-30 bg-white rounded-md mb-8">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </Button>
            <div>
              <Typography
                variant="p-s"
                color="N400"
                className="uppercase tracking-wider font-semibold"
              >
                Products
              </Typography>
              <Typography variant="h-s" fontWeight="bold" color="N800">
                {editing ? "Edit Product" : "Create New Product"}
              </Typography>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => navigate(-1)}
            >
              Discard
            </Button>
            <Button
              type="button"
              variant="primary"
              loading={saving}
              disabled={saving}
              size="sm"
              onClick={handleSubmit(onSubmit, (e) =>
                console.warn("Validation errors", e),
              )}
            >
              {editing ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          const target = e.target as HTMLElement;
          if (e.key === "Enter" && target.tagName !== "TEXTAREA") {
            e.preventDefault();
          }
        }}
        className=" mx-auto
          grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-6 items-start"
      >
        <div className="flex flex-col gap-5">
          <FormSection
            icon={<Package size={16} />}
            title="General Information"
            subtitle="Basic product details"
          >
            <FormField
              label="Product Name"
              required
              registration={register("productName")}
              error={errors.productName?.message}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
            />
            <FormField
              label="Brand"
              registration={register("brand")}
              error={errors.brand?.message}
              placeholder="e.g. Sony"
              hint="Leave blank if unbranded"
            />
            <FormTextarea
              label="Description"
              required
              rows={5}
              registration={register("description")}
              error={errors.description?.message}
              placeholder="Describe your product — materials, key features, what makes it unique…"
            />
            <FormField
              label="Weight"
              registration={register("weight")}
              placeholder="e.g. 250g"
              hint="Helps with shipping calculations (optional)"
            />
          </FormSection>

          <FormSection
            icon={<DollarSign size={16} />}
            title="Pricing"
            subtitle="Base price and optional discount"
          >
            <FormField
              label="Base Price"
              required
              type="number"
              min={0}
              prefix="₦"
              registration={register("basePrice", { valueAsNumber: true })}
              error={errors.basePrice?.message}
              placeholder="0"
            />

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Typography
                  variant="p-s"
                  fontWeight="bold"
                  color="N500"
                  className="uppercase tracking-wider"
                >
                  Discount
                </Typography>
                {discountDisabled && (
                  <span className="flex items-center gap-1 text-xs text-N400">
                    <Info size={11} /> Enter base price first
                  </span>
                )}
              </div>

              <FormField
                label="Promotion Name"
                registration={register("promotionName")}
                disabled={discountDisabled}
                placeholder="e.g. Summer Sale"
              />

              <DiscountRow
                pct={watched.discountPercentage ?? 0}
                price={watched.discountedPrice ?? 0}
                base={basePrice}
                disabled={discountDisabled}
                onPct={syncPct}
                onPrice={syncPrice}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Discount Start Date"
                  type="date"
                  registration={register("discountStartDate")}
                  disabled={discountDisabled}
                  error={errors.discountStartDate?.message}
                />
                <FormField
                  label="Discount End Date"
                  type="date"
                  registration={register("discountEndDate")}
                  disabled={discountDisabled}
                  error={errors.discountEndDate?.message}
                />
              </div>
            </div>
          </FormSection>

          {/* Warranty & Returns */}
          <FormSection
            icon={<ShieldCheck size={16} />}
            title="Warranty & Returns"
            subtitle="Set your return and warranty policy"
          >
            <YesNoToggle
              label="Is this product returnable?"
              value={watched.isReturnable}
              onChange={(v) =>
                setValue("isReturnable", v, { shouldValidate: true })
              }
            />
            {watched.isReturnable && (
              <FormField
                label="Return Window"
                required
                type="number"
                min={1}
                max={30}
                registration={register("returnableDays", {
                  valueAsNumber: true,
                })}
                error={errors.returnableDays?.message}
                suffix="days"
                placeholder="e.g. 14"
              />
            )}

            <div className="border-t border-N20 pt-4">
              <YesNoToggle
                label="Does this product have a warranty?"
                value={watched.hasWarranty}
                onChange={(v) =>
                  setValue("hasWarranty", v, { shouldValidate: true })
                }
              />
              {watched.hasWarranty && (
                <div className="mt-4">
                  <FormField
                    label="Warranty Duration"
                    required
                    type="number"
                    min={1}
                    max={10}
                    registration={register("warrantyYears", {
                      valueAsNumber: true,
                    })}
                    error={errors.warrantyYears?.message}
                    suffix="years"
                    placeholder="e.g. 2"
                  />
                </div>
              )}
            </div>
          </FormSection>

          {/* Engraving / Personalisation */}
          <FormSection
            icon={<PenLine size={16} />}
            title="Engraving & Personalisation"
            subtitle="Let customers add a custom engraving for a fee"
          >
            <YesNoToggle
              label="Offer engraving on this product?"
              value={watched.engravingAvailable}
              onChange={(v) =>
                setValue("engravingAvailable", v, { shouldValidate: true })
              }
            />
            {watched.engravingAvailable && (
              <div className="flex flex-col gap-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Engraving Fee"
                    required
                    type="number"
                    min={0}
                    prefix="₦"
                    registration={register("engravingFee", {
                      valueAsNumber: true,
                    })}
                    error={errors.engravingFee?.message}
                    placeholder="e.g. 8000"
                  />
                  <FormField
                    label="Max Characters"
                    required
                    type="number"
                    min={1}
                    max={200}
                    registration={register("engravingMaxCharacters", {
                      valueAsNumber: true,
                    })}
                    error={errors.engravingMaxCharacters?.message}
                    placeholder="e.g. 20"
                  />
                </div>
                <FormField
                  label="Max Lines"
                  required
                  type="number"
                  min={1}
                  max={10}
                  registration={register("engravingMaxLines", {
                    valueAsNumber: true,
                  })}
                  error={errors.engravingMaxLines?.message}
                  placeholder="e.g. 3"
                />
                <FormField
                  label="Available Fonts"
                  registration={register("engravingFonts")}
                  placeholder="e.g. Gill Sans, Times New Roman, Script"
                  hint="Comma-separated. Leave blank to use the default font."
                />
              </div>
            )}
          </FormSection>

          {/* Variation Group */}
          <FormSection
            icon={<Layers size={16} />}
            title="Variation Group"
            subtitle="Link products together as variations (like Amazon product families)"
          >
            <FormField
              label="Variation Group ID"
              registration={register("variationGroup")}
              placeholder="e.g. goodr-og-sunglasses"
              hint="Products sharing the same group ID appear as sibling variations on the storefront"
            />
            <FormField
              label="Variation Label"
              registration={register("variationLabel")}
              placeholder="e.g. Color, Style, Size"
              hint="The dimension name shown on the storefront (e.g. 'Color')"
            />
            <FormField
              label="Variation Value"
              registration={register("variationValue")}
              placeholder="e.g. Silver / Blue / Black"
              hint="This product's specific value within the group (e.g. 'Silver / Blue / Black')"
            />
          </FormSection>

          {/* SEO */}
          <FormSection
            icon={<Globe size={16} />}
            title="SEO & Social"
            subtitle="Optimize for search engines and social sharing"
          >
            <FormField
              label="Meta Title"
              registration={register("metaTitle")}
              placeholder="Custom page title (defaults to product name)"
              hint="Max 60 characters recommended"
            />
            <FormTextarea
              label="Meta Description"
              rows={2}
              registration={register("metaDescription")}
              placeholder="Brief product summary for search results (max 160 chars)"
            />
          </FormSection>

          {/* Audience & Scheduling */}
          <FormSection
            icon={<Users size={16} />}
            title="Audience & Scheduling"
            subtitle="Target audience and publish schedule"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-N700">Target Audience</label>
              <select
                {...register("audience")}
                className="h-10 px-3 border border-N40 rounded-lg text-sm bg-white focus:outline-none"
              >
                <option value="">All audiences</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>

            <FormField
              label="Low Stock Threshold"
              type="number"
              min={1}
              registration={register("lowStockThreshold", { valueAsNumber: true })}
              hint="Show urgency message when stock falls below this"
              placeholder="5"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-N700">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-N400" />
                  Scheduled Publish
                </span>
              </label>
              <input
                type="datetime-local"
                {...register("scheduledPublishAt")}
                className="h-10 px-3 border border-N40 rounded-lg text-sm bg-white focus:outline-none"
              />
              <span className="text-xs text-N400">
                Leave empty to publish immediately. Scheduled products are saved as draft until the publish time.
              </span>
            </div>
          </FormSection>

          {/* Videos */}
          <FormSection
            icon={<Video size={16} />}
            title="Product Videos"
            subtitle="Add video URLs for the product gallery"
          >
            <FormTextarea
              label="Video URLs"
              rows={2}
              registration={register("videoUrls")}
              placeholder="Comma-separated video URLs (e.g. https://example.com/video.mp4)"
            />
          </FormSection>

          {/* Variants */}
          <FormSection
            icon={<Layers size={16} />}
            title="Product Variants"
            subtitle="Add variations like size, colour, or storage"
            action={
              variants.length > 0 ? (
                <Button
                  type="button"
                  variant="brown-light"
                  types="outline"
                  size="sm"
                  onClick={addVariant}
                >
                  <span className="flex items-center gap-1.5">
                    <Plus size={13} />
                    Add Variant
                  </span>
                </Button>
              ) : null
            }
          >
            {variants.length === 0 ? (
              <div className="flex flex-col items-center  justify-center gap-4 py-10 rounded-xl border-2 border-dashed border-N30 bg-N10">
                <div className="w-16 h-16 rounded-2xl bg-white border border-N30 shadow-sm flex items-center justify-center">
                  <Layers size={24} className="text-BR400" />
                </div>
                <div className="text-center flex flex-col items-center">
                  <Typography variant="p-m" fontWeight="medium" color="N600">
                    No variants yet
                  </Typography>
                  <Typography variant="p-s" color="N400">
                    Add size, colour, or other variations
                  </Typography>
                </div>
                <Button
                  type="button"
                  size={"sm"}
                  variant="primary"
                  onClick={addVariant}
                >
                  <span className="flex items-center gap-2">
                    <Plus size={15} />
                    Add First Variant
                  </span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {variants.map((v, i) => (
                  <VariantForm
                    key={v.id}
                    index={i}
                    categoryAttributes={categoryAttrs}
                    onRemove={() => removeVariant(i)}
                  />
                ))}
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-dashed border-N40 hover:border-BR200 hover:bg-BR50/60 text-N400 hover:text-BR400 text-sm font-semibold transition-all duration-150"
                >
                  <Plus size={15} />
                  Add Another Variant
                </button>
              </div>
            )}
          </FormSection>
        </div>

        {/* ══ RIGHT SIDEBAR ════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-[65px]">
          {/* Images */}
          <div className="bg-white rounded-xl border border-N30 overflow-hidden">
            <div className="px-5 py-4 border-b border-N20 bg-N10/50">
              <Typography variant="p-m" fontWeight="bold" color="N700">
                Product Images
              </Typography>
              <Typography variant="p-s" color="N400">
                First image is used as cover
              </Typography>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <CoverUpload
                image={coverImg}
                onAdd={addCover}
                onRemove={removeCover}
                error={(errors.coverImage as any)?.message}
              />
              <ThumbnailGrid
                images={picFields as unknown as ProductPicture[]}
                onAdd={addPic}
                onRemove={rmPic}
                max={6}
                label="Additional images"
              />
            </div>
          </div>

          {/* Organisation */}
          <div className="bg-white rounded-xl border border-N30 overflow-hidden">
            <div className="px-5 py-4 border-b border-N20 bg-N10/50 flex items-center gap-2">
              <Tag size={14} className="text-BR400" />
              <Typography variant="p-m" fontWeight="bold" color="N700">
                Organisation
              </Typography>
            </div>
            <div className="p-5 flex flex-col gap-5">
              {/* Category */}
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <SingleSelect
                    label="Category"
                    required
                    value={field.value?.value ? field.value : null}
                    onChange={(opt) => {
                      field.onChange(opt ?? { label: "", value: "" });
                      setActiveCategoryId(opt?.value ?? "");
                      setValue("attributes", {});
                      setValue("variants", []);
                    }}
                    options={categoryOptions}
                    placeholder="Select category…"
                    error={errors.category?.message as string}
                  />
                )}
              />

              {/* Quantity */}
              <FormField
                label="Stock Quantity"
                required
                type="number"
                min={0}
                registration={register("quantity", { valueAsNumber: true })}
                error={errors.quantity?.message}
                placeholder="0"
              />

              {/* Tags */}
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagSelect
                    label="Tags"
                    required
                    value={field.value ?? []}
                    onChange={field.onChange}
                    options={TAG_SUGGESTIONS}
                    error={errors.tags?.message as string}
                  />
                )}
              />
            </div>
          </div>

          {/* Category attributes */}
          {categoryAttrs.length > 0 && (
            <div className="bg-white rounded-xl border border-N30 overflow-hidden">
              <div className="px-5 py-4 border-b border-N20 bg-N10/50">
                <Typography variant="p-m" fontWeight="bold" color="N700">
                  Category Attributes
                </Typography>
                <Typography variant="p-s" color="N400">
                  {activeCategory?.name}
                </Typography>
              </div>
              <div className="p-5 flex flex-col gap-4">
                {requiredAttrs.map((attr) => (
                  <AttributeRenderer key={attr.id} attr={attr} />
                ))}
                {optionalAttrs.length > 0 && (
                  <>
                    {showOptionalAttrs &&
                      optionalAttrs.map((attr) => (
                        <AttributeRenderer key={attr.id} attr={attr} />
                      ))}
                    <button
                      type="button"
                      onClick={() => setShowOptionalAttrs((p) => !p)}
                      className="self-start text-xs font-semibold text-BR300 hover:text-BR400 transition-colors"
                    >
                      {showOptionalAttrs
                        ? "− Hide optional"
                        : "+ Show optional attributes"}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default ProductFormPage;
