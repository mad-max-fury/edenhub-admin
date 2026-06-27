import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ImagePlus, X } from "lucide-react";

import {
  Button,
  SMSelectDropDown,
  Spinner,
  TextField,
  Toggle,
  Typography,
  notify,
} from "@/components";
import {
  useCreateCategoryMutation,
  useGetCategoriesUnpaginatedQuery,
  useUpdateCategoryByIdMutation,
  type ICategory,
  type ICategoryAttribute,
} from "@/redux/api/categories";
import { useUploadMutation } from "@/redux/api/resources";
import { getErrorMessage } from "@/utils/getErrorMessges";

import AttributeBuilder from "./AttributeBuilder";
import { categorySchema, type CategoryFormValues } from "./schema";
import ImageWrapper from "@/components/imageLoader/ImageLoader";

const MAX_CATEGORY_DEPTH = 3;

type Props = {
  initialData?: ICategory;
  onClose: () => void;
};

const parentId = (parent: ICategory["parent"]): string => {
  if (!parent) return "";
  return typeof parent === "string" ? parent : parent._id;
};

const EditOrCreateCategory = ({ initialData, onClose }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState(initialData?.image ?? "");

  const { data: categoriesRes, isLoading: loadingParents } =
    useGetCategoriesUnpaginatedQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryByIdMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadMutation();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema) as any,
    mode: "onChange",
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      parent: parentId(initialData?.parent),
      image: initialData?.image ?? "",
      isActive: initialData?.isActive ?? true,
      attributes: (initialData?.attributes ??
        []) as CategoryFormValues["attributes"],
    },
  });

  const parentOptions = useMemo(() => {
    const list = categoriesRes?.data ?? [];
    return list
      .filter((c) => c.level < MAX_CATEGORY_DEPTH && c._id !== initialData?._id)
      .map((c) => ({
        label: "—".repeat(c.level - 1) + (c.level > 1 ? " " : "") + c.name,
        value: c._id,
      }));
  }, [categoriesRes, initialData]);

  const selectedParent = watch("parent");
  const isActive = watch("isActive");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    try {
      const res = await uploadFile({
        file,
        params: { type: "categories" },
      }).unwrap();
      setValue("image", res.data.url, { shouldValidate: true });
    } catch (err) {
      setImagePreview(initialData?.image ?? "");
      notify.error({
        message: "Image upload failed",
        subtitle: getErrorMessage(err),
      });
    }
  };

  const clearImage = () => {
    setImagePreview("");
    setValue("image", "");
  };

  const onSubmit = async (values: CategoryFormValues) => {
    const payload = {
      name: values.name,
      description: values.description || undefined,
      parent: values.parent || null,
      image: values.image || undefined,
      isActive: values.isActive,
      attributes: (values.attributes ?? []).map((attr, index) => ({
        ...attr,
        order: index,
      })) as ICategoryAttribute[],
    };

    try {
      if (initialData) {
        await updateCategory({ id: initialData._id, ...payload }).unwrap();
        notify.success({
          message: "Updated successfully",
          subtitle: `You have updated ${values.name}`,
        });
      } else {
        await createCategory(payload).unwrap();
        notify.success({
          message: "Created successfully",
          subtitle: `You have created ${values.name}`,
        });
      }
      onClose();
    } catch (err) {
      notify.error({
        message: "Action failed",
        subtitle: getErrorMessage(err),
      });
    }
  };

  if (loadingParents) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full animate-in fade-in duration-500"
    >
      <div className="flex-1 overflow-y-auto flex flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-md border border-N40 bg-N10 overflow-hidden flex items-center justify-center">
            {imagePreview ? (
              <>
                <ImageWrapper
                  src={imagePreview}
                  alt="Category"
                  className="w-full h-full object-cover"
                  fill
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5"
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
              </>
            ) : (
              <ImagePlus size={22} className="text-N400" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              loading={isUploading}
            >
              {imagePreview ? "Change image" : "Upload image"}
            </Button>
            <Typography variant="c-s" color="N500">
              PNG or JPG. Optional.
            </Typography>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>

        <TextField
          label="Category name"
          name="name"
          register={register}
          placeholder="e.g. Electronics"
          error={!!errors.name}
          errorText={errors.name?.message}
        />

        <TextField
          label="Description"
          name="description"
          inputType="textarea"
          register={register}
          placeholder="Short description (optional)"
          error={!!errors.description}
          errorText={errors.description?.message}
        />

        <SMSelectDropDown
          label="Parent category"
          placeholder="None (top-level category)"
          options={parentOptions}
          value={parentOptions.find((o) => o.value === selectedParent) ?? null}
          onChange={(opt) => setValue("parent", opt?.value as string)}
          isError={!!errors.parent}
          errorText={errors.parent?.message as string}
        />
        {selectedParent && (
          <button
            type="button"
            onClick={() => setValue("parent", "")}
            className="text-BR500 text-xs font-medium w-fit -mt-4 hover:underline"
          >
            Clear parent (make top-level)
          </button>
        )}

        <div className="flex items-center justify-between border border-N30 rounded-md p-4">
          <div>
            <Typography variant="h-s" fontWeight="medium">
              Active
            </Typography>
            <Typography variant="c-s" color="N500">
              Inactive categories are hidden from the storefront.
            </Typography>
          </div>
          <Toggle
            checked={!!isActive}
            onChange={(checked) => setValue("isActive", checked)}
          />
        </div>

        <hr className="border-N30" />

        <AttributeBuilder
          control={control}
          register={register}
          errors={errors}
          setValue={setValue}
        />
      </div>

      <div className="p-6 border-t border-N30 flex justify-end gap-3 bg-white">
        <Button variant="secondary" onClick={onClose} size="sm" type="button">
          Cancel
        </Button>
        <Button
          size="sm"
          type="submit"
          loading={isCreating || isUpdating}
          disabled={isUploading}
        >
          {initialData ? "Save Changes" : "Create Category"}
        </Button>
      </div>
    </form>
  );
};

export default EditOrCreateCategory;
