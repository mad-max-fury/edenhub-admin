import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useForm,
  FormProvider,
  useFieldArray,
  Controller,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { notify } from "@/components";
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
  Save,
  LoaderCircle,
  Info,
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
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-N700">Discount %</label>
      <input
        type="number"
        min={0}
        max={100}
        disabled={disabled}
        value={pct}
        onChange={(e) => onPct(Number(e.target.value))}
        className="w-full px-3.5 py-2.5 rounded-lg border border-N40 text-sm bg-white focus:outline-none focus:border-B200 focus:ring-2 focus:ring-B200/20 transition-all"
      />
    </div>
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-N700">Discounted Price</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-N400 pointer-events-none select-none">
          ₦
        </span>
        <input
          type="number"
          min={0}
          max={base}
          disabled={disabled}
          value={price}
          onChange={(e) => onPrice(Number(e.target.value))}
          className="w-full pl-8 pr-3.5 py-2.5 rounded-lg border border-N40 text-sm bg-white focus:outline-none focus:border-B200 focus:ring-2 focus:ring-B200/20 transition-all"
        />
      </div>
    </div>
  </div>
);

// ─── Category adapter ─────────────────────────────────────────────────────────
// Map an API attribute to the shape the product form/schema consume (id-keyed).
const mapAttribute = (attr: IApiCategoryAttribute): ICategoryAttribute => ({
  id: attr._id ?? attr.name,
  name: attr.name,
  inputType: attr.inputType,
  isRequired: attr.isRequired,
  order: attr.order,
  options: attr.options ?? [],
});

// Flatten the nested category tree into a selectable list, accumulating
// ancestor attributes so a product placed in a leaf inherits parent attributes
// (mirrors the backend's inheritance).
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

// ─── Main ─────────────────────────────────────────────────────────────────────
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

  // Live categories (flattened tree with inherited attributes)
  const { data: categoryTree } = useGetCategoryTreeQuery();
  const categories = useMemo(
    () => flattenCategories(categoryTree?.data ?? []),
    [categoryTree],
  );

  // Category drives attribute schema + attribute fields
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

  // ── form ────────────────────────────────────────────────────────────────────
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
      weight: "",
      tags: [],
      category: { label: "", value: "" },
      quantity: 0,
      pictures: [],
      attributes: {},
      variants: [],
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

  // ── hydrate in edit mode ──────────────────────────────────────────────────
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingProduct]);
  const watched = watch();
  const basePrice = watched.basePrice ?? 0;
  const discountDisabled = !basePrice || basePrice <= 0;

  // ── discount helpers ────────────────────────────────────────────────────────
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

  // ── field arrays ────────────────────────────────────────────────────────────
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

  // ── submit ──────────────────────────────────────────────────────────────────

  // Upload a picture if it carries a File; otherwise keep its existing URL.
  const resolvePicture = async (pic?: ProductPicture): Promise<string | undefined> => {
    if (!pic) return undefined;
    if (pic.file) {
      const res = await uploadFile({
        file: pic.file,
        params: { type: "products" },
      }).unwrap();
      return res.data.url;
    }
    // Existing image (edit mode) — preview already holds the stored URL.
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
        variants,
        status: "active",
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

  // ── summary values ──────────────────────────────────────────────────────────
  const totalStock =
    (watched.quantity ?? 0) +
    (watched.variants ?? []).reduce((s, v) => s + (v.quantity ?? 0), 0);

  return (
    <FormProvider {...methods}>
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-N30">
        <div className="flex items-center justify-between px-6 py-3.5 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-N20 text-N500 hover:text-N700 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <p className="text-[11px] text-N400 font-semibold uppercase tracking-wider">
                Products
              </p>
              <h1 className="text-base font-bold text-N800 leading-tight">
                {editing ? "Edit Product" : "Create New Product"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border border-N40 text-sm font-semibold text-N600 hover:bg-N20 transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleSubmit(onSubmit, (e) =>
                console.warn("Validation errors", e),
              )}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-B300 hover:bg-B400 active:bg-B500 text-white text-sm font-bold transition-colors disabled:opacity-60 shadow-sm"
            >
              {saving ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {saving ? "Saving…" : editing ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </div>
      </div>

      {/* Page body */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8
          grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-6 items-start"
      >
        {/* ══ LEFT COLUMN ══════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-5">
          {/* General */}
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

          {/* Pricing */}
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

            {/* Discount block */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-N500 uppercase tracking-wider">
                  Discount
                </p>
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

          {/* Variants */}
          <FormSection
            icon={<Layers size={16} />}
            title="Product Variants"
            subtitle="Add variations like size, colour, or storage"
            action={
              variants.length > 0 ? (
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-B50 border border-B75 text-B400 text-xs font-bold hover:bg-B75 transition-colors"
                >
                  <Plus size={13} />
                  Add Variant
                </button>
              ) : null
            }
          >
            {variants.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-10 rounded-xl border-2 border-dashed border-N30 bg-N10">
                <div className="w-16 h-16 rounded-2xl bg-white border border-N30 shadow-sm flex items-center justify-center">
                  <Layers size={28} className="text-N200" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-N600">
                    No variants yet
                  </p>
                  <p className="text-xs text-N400 mt-0.5">
                    Add size, colour, or other variations
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-B300 hover:bg-B400 text-white text-sm font-bold transition-colors shadow-sm"
                >
                  <Plus size={15} />
                  Add First Variant
                </button>
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
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-dashed border-N40 hover:border-B200 hover:bg-B50/60 text-N400 hover:text-B400 text-sm font-semibold transition-all duration-150"
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
              <h3 className="text-sm font-bold text-N700">Product Images</h3>
              <p className="text-xs text-N400 mt-0.5">
                First image is used as cover
              </p>
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
              <Tag size={14} className="text-B400" />
              <h3 className="text-sm font-bold text-N700">Organisation</h3>
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
                <h3 className="text-sm font-bold text-N700">
                  Category Attributes
                </h3>
                <p className="text-xs text-N400 mt-0.5">
                  {activeCategory?.name}
                </p>
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
                      className="self-start text-xs font-semibold text-B300 hover:text-B400 transition-colors"
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

          {/* Live summary */}
          {(basePrice > 0 || variants.length > 0) && (
            <div className="bg-N800 rounded-xl p-5 flex flex-col gap-3">
              <p className="text-[10px] font-bold text-N300 uppercase tracking-widest">
                Summary
              </p>
              {basePrice > 0 && (
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-N400">Base price</span>
                  <span className="text-sm font-bold text-white">
                    ₦{Number(basePrice).toLocaleString()}
                  </span>
                </div>
              )}
              {(watched.discountPercentage ?? 0) > 0 && (
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-N400">
                    After {watched.discountPercentage}% off
                  </span>
                  <span className="text-sm font-bold text-G200">
                    ₦{Number(watched.discountedPrice ?? 0).toLocaleString()}
                  </span>
                </div>
              )}
              {variants.length > 0 && (
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-N400">Variants</span>
                  <span className="text-sm font-bold text-white">
                    {variants.length}
                  </span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-white/10 pt-3 mt-1">
                <span className="text-xs text-N400">Total stock</span>
                <span className="text-sm font-bold text-white">
                  {totalStock} units
                </span>
              </div>
            </div>
          )}
        </div>
      </form>
    </FormProvider>
  );
};

export default ProductFormPage;
