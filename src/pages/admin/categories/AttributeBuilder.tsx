import { Plus, Trash2, X } from "lucide-react";
import {
  useFieldArray,
  type Control,
  type UseFormRegister,
  type UseFormWatch,
  type FieldErrors,
} from "react-hook-form";

import { Button, SMSelectDropDown, TextField, Toggle, Typography } from "@/components";
import {
  ATTRIBUTE_INPUT_TYPES,
  inputTypeNeedsOptions,
  type CategoryFormValues,
} from "./schema";

interface Props {
  control: Control<CategoryFormValues>;
  register: UseFormRegister<CategoryFormValues>;
  watch: UseFormWatch<CategoryFormValues>;
  errors: FieldErrors<CategoryFormValues>;
  setValue: (name: any, value: any) => void;
}

// Nested option editor for a single attribute (only for choice-based types).
const AttributeOptions = ({
  attrIndex,
  control,
  register,
  errors,
}: {
  attrIndex: number;
  control: Control<CategoryFormValues>;
  register: UseFormRegister<CategoryFormValues>;
  errors: FieldErrors<CategoryFormValues>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `attributes.${attrIndex}.options` as const,
  });

  const optionErrors = errors.attributes?.[attrIndex]?.options as
    | { message?: string }
    | undefined;

  return (
    <div className="flex flex-col gap-2 mt-3">
      <Typography variant="c-s" color="N600" fontWeight="medium">
        Options
      </Typography>

      {fields.map((field, optIndex) => (
        <div key={field.id} className="flex items-center gap-2">
          <div className="flex-1">
            <TextField
              name={`attributes.${attrIndex}.options.${optIndex}.label`}
              register={register}
              placeholder="Label (e.g. Small)"
              error={
                !!(errors.attributes?.[attrIndex] as any)?.options?.[optIndex]
                  ?.label
              }
            />
          </div>
          <div className="flex-1">
            <TextField
              name={`attributes.${attrIndex}.options.${optIndex}.value`}
              register={register}
              placeholder="Value (e.g. sm)"
              error={
                !!(errors.attributes?.[attrIndex] as any)?.options?.[optIndex]
                  ?.value
              }
            />
          </div>
          <button
            type="button"
            onClick={() => remove(optIndex)}
            className="p-2 text-N400 hover:text-R400 transition-colors"
            aria-label="Remove option"
          >
            <X size={16} />
          </button>
        </div>
      ))}

      {typeof optionErrors?.message === "string" && (
        <Typography variant="c-s" color="R400">
          {optionErrors.message}
        </Typography>
      )}

      <button
        type="button"
        onClick={() => append({ label: "", value: "" })}
        className="flex items-center gap-1 text-BR500 text-xs font-medium w-fit hover:underline"
      >
        <Plus size={14} /> Add option
      </button>
    </div>
  );
};

const AttributeBuilder = ({
  control,
  register,
  watch,
  errors,
  setValue,
}: Props) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attributes",
  });

  const attributes = watch("attributes");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="h-s" fontWeight="bold">
            Attributes
          </Typography>
          <Typography variant="c-s" color="N500">
            Fields buyers fill in for products in this category (e.g. Size, Color).
          </Typography>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() =>
            append({
              name: "",
              inputType: "text",
              isRequired: false,
              order: fields.length,
              options: [],
            })
          }
        >
          <div className="flex items-center gap-1">
            <Plus size={14} />
            <span className="text-xs">Add attribute</span>
          </div>
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="border border-dashed border-N40 rounded-md p-6 text-center">
          <Typography variant="p-s" color="N500">
            No attributes yet. Add one to capture category-specific details.
          </Typography>
        </div>
      )}

      {fields.map((field, index) => {
        const currentType = attributes?.[index]?.inputType;
        const attrError = errors.attributes?.[index];

        return (
          <div
            key={field.id}
            className="border border-N30 rounded-md p-4 flex flex-col gap-3 bg-N0"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <TextField
                  label="Attribute name"
                  name={`attributes.${index}.name`}
                  register={register}
                  placeholder="e.g. Size"
                  error={!!attrError?.name}
                  errorText={attrError?.name?.message as string}
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-8 p-2 text-N400 hover:text-R400 transition-colors"
                aria-label="Remove attribute"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
              <SMSelectDropDown
                label="Input type"
                options={ATTRIBUTE_INPUT_TYPES as any}
                value={
                  ATTRIBUTE_INPUT_TYPES.find(
                    (o) => o.value === currentType,
                  ) as any
                }
                onChange={(opt) => {
                  setValue(`attributes.${index}.inputType`, opt.value);
                  if (!inputTypeNeedsOptions(opt.value as string)) {
                    setValue(`attributes.${index}.options`, []);
                  }
                }}
                searchable={false}
                isError={!!attrError?.inputType}
                errorText={attrError?.inputType?.message as string}
              />

              <div className="flex items-center gap-2 md:mt-6">
                <Toggle
                  label="Required"
                  checked={!!attributes?.[index]?.isRequired}
                  onChange={(checked) =>
                    setValue(`attributes.${index}.isRequired`, checked)
                  }
                />
              </div>
            </div>

            {inputTypeNeedsOptions(currentType) && (
              <AttributeOptions
                attrIndex={index}
                control={control}
                register={register}
                errors={errors}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AttributeBuilder;
