import { useController, useFormContext, type Path } from "react-hook-form";
import { SMSelectDropDown } from "@/components";
import type { ICategoryAttribute, ProductFormData } from "../types";

interface Props {
  attr: ICategoryAttribute;
  namePrefix?: string;
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-N40 text-sm bg-white focus:outline-none focus:border-BR200 focus:ring-2 focus:ring-BR200/20 transition-all duration-150";

const AttributeRenderer = ({ attr, namePrefix = "attributes" }: Props) => {
  const { control } = useFormContext<ProductFormData>();

  const fieldPath = `${namePrefix}.${attr.id}` as Path<ProductFormData>;

  const {
    field: { onChange, value, onBlur, ref },
    fieldState: { error },
  } = useController({
    name: fieldPath,
    control,
  });

  const labelNode = (
    <p className="text-sm font-medium text-N700 mb-1.5">
      {attr.name} {attr.isRequired && <span className="text-R400">*</span>}
    </p>
  );

  const errorNode = error ? (
    <p className="text-xs text-R400 mt-1">{error.message}</p>
  ) : null;

  switch (attr.inputType) {
    case "text":
      return (
        <div className="flex flex-col">
          {labelNode}
          <input
            className={inputCls}
            type="text"
            value={typeof value === "string" || typeof value === "number" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            ref={ref}
            placeholder={`Enter ${attr.name}`}
          />
          {errorNode}
        </div>
      );

    case "radio":
      return (
        <div className="flex flex-col">
          {labelNode}
          <div className="flex flex-wrap gap-2">
            {attr.options?.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChange(opt.value)}
                className={`px-4 py-2 rounded-lg text-sm border transition-colors ${value === opt.value ? "bg-BR300 text-white border-BR300" : "bg-white text-N600 border-N40 hover:border-BR200"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errorNode}
        </div>
      );

    case "checkbox":
      return (
        <div className="flex flex-col">
          {labelNode}
          <div className="flex flex-wrap gap-2">
            {attr.options?.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange(isSelected ? "" : opt.value)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm border transition-colors ${isSelected ? "bg-BR50 text-BR400 border-BR200 font-semibold" : "bg-white text-N500 border-N40 hover:border-BR200"}`}
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? "bg-BR300 border-BR300" : "border-N40"}`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-sm" />
                    )}
                  </div>
                  {opt.label}
                </button>
              );
            })}
          </div>
          {errorNode}
        </div>
      );

    case "select":
    default:
      return (
        <div className="flex flex-col">
          {labelNode}
          <SMSelectDropDown
            options={attr.options ?? []}
            value={attr.options?.find((o) => o.value === value) ?? null}
            onChange={(opt) => onChange(opt?.value ?? "")}
            placeholder={`Select ${attr.name}`}
            searchable
            isClearable
          />
          {errorNode}
        </div>
      );
  }
};

export default AttributeRenderer;
