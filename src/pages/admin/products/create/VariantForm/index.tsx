import { useState } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { ChevronDown, Trash2 } from "lucide-react";

import type {
  ICategoryAttribute,
  ProductFormData,
  ProductPicture,
} from "../types";
import { TAG_SUGGESTIONS } from "../mockData";
import { FormField } from "../FormPrimitives";
import { ThumbnailGrid } from "../ImageUpload";
import AttributeRenderer from "../AttributeRenderer";
import TagSelect from "../TagSelect";

interface Props {
  index: number;
  categoryAttributes: ICategoryAttribute[];
  onRemove: () => void;
}

const VariantForm = ({ index, categoryAttributes, onRemove }: Props) => {
  const [open, setOpen] = useState(true);
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const variantErrors = errors.variants?.[index];
  const name = watch(`variants.${index}.name`);

  const {
    fields: pics,
    append: addPic,
    remove: removePic,
  } = useFieldArray({ control, name: `variants.${index}.pictures` });

  return (
    <div className="rounded-xl border border-N30 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-N10/60 border-b border-N20">
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2 text-left"
        >
          <ChevronDown
            size={16}
            className={`text-N400 transition-transform ${open ? "" : "-rotate-90"}`}
          />
          <span className="text-sm font-bold text-N700">
            {name?.trim() || `Variant ${index + 1}`}
          </span>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-lg text-N400 hover:text-R400 hover:bg-R50 transition-colors"
          aria-label="Remove variant"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {open && (
        <div className="p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Replace the old Variant Name FormField with this: */}
            <Controller
              control={control}
              name={`variants.${index}.name`}
              render={({ field }) => (
                <FormField
                  label="Variant Name"
                  required
                  placeholder="e.g. Black / 42mm"
                  error={variantErrors?.name?.message}
                  // @ts-expect-error
                  registration={field}
                />
              )}
            />
            <Controller
              control={control}
              name={`variants.${index}.basePrice`}
              render={({ field }) => (
                <FormField
                  label="Base Price"
                  required
                  type="number"
                  min={0}
                  prefix="₦"
                  // We spread the field object to map name, ref, onBlur, and value
                  // and override onChange to handle the empty string correctly
                  registration={{
                    ...field,
                    // @ts-expect-error
                    onChange: (e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? undefined : Number(val));
                    },
                  }}
                  error={variantErrors?.basePrice?.message}
                  placeholder="0"
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={control}
              name={`variants.${index}.quantity`}
              render={({ field }) => (
                <FormField
                  label="Stock Quantity"
                  required
                  type="number"
                  min={0}
                  registration={{
                    ...field,
                    // @ts-expect-error
                    onChange: (e) => {
                      const val = e.target.value;
                      field.onChange(val === "" ? undefined : Number(val));
                    },
                  }}
                  error={variantErrors?.quantity?.message}
                  placeholder="0"
                />
              )}
            />
            <Controller
              control={control}
              name={`variants.${index}.discountPercentage`}
              render={({ field }) => (
                <FormField
                  label="Discount %"
                  type="number"
                  min={0}
                  max={100}
                  registration={{
                    ...field,
                    // @ts-expect-error
                    onChange: (e) => {
                      const val = e.target.value;
                      // Prevents NaN. If the user clears the input, it becomes undefined.
                      field.onChange(val === "" ? undefined : Number(val));
                    },
                  }}
                  error={variantErrors?.discountPercentage?.message}
                  placeholder="0"
                />
              )}
            />
          </div>

          {/* Variant-specific attribute values */}
          {categoryAttributes.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-N20 pt-4">
              <p className="text-xs font-bold text-N500 uppercase tracking-wider">
                Attributes
              </p>
              {categoryAttributes.map((attr) => (
                <AttributeRenderer
                  key={attr.id}
                  attr={attr}
                  namePrefix={`variants.${index}.attributes`}
                />
              ))}
            </div>
          )}

          {/* Tags */}
          <Controller
            name={`variants.${index}.tags`}
            control={control}
            render={({ field }) => (
              <TagSelect
                label="Variant Tags"
                value={field.value ?? []}
                onChange={field.onChange}
                options={TAG_SUGGESTIONS}
              />
            )}
          />

          {/* Images */}
          <ThumbnailGrid
            images={pics as unknown as ProductPicture[]}
            onAdd={(file: File) =>
              addPic({
                id: `vpic-${Date.now()}`,
                file,
                preview: URL.createObjectURL(file),
              })
            }
            onRemove={(i: number) => removePic(i)}
            max={6}
            label="Variant images"
          />
        </div>
      )}
    </div>
  );
};

export default VariantForm;
