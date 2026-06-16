import { useFormContext } from "react-hook-form";
import type { ICategoryAttribute, ProductFormData } from "../types";

interface Props {
  attr: ICategoryAttribute;
  /**
   * Root product: "attributes"
   * Variant:      "variants.2.attributes"
   */
  namePrefix?: string;
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-N40 text-sm bg-white focus:outline-none focus:border-B200 focus:ring-2 focus:ring-B200/20 transition-all duration-150 placeholder:text-N60";

const AttributeRenderer = ({ attr, namePrefix = "attributes" }: Props) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const bag =
    (watch(namePrefix as keyof ProductFormData) as Record<
      string,
      string | undefined
    >) ?? {};

  // ── error resolution ──────────────────────────────────────────────────────
  let fieldError: string | undefined;
  if (namePrefix === "attributes") {
    fieldError = (errors?.attributes as any)?.[attr.id]?.message;
  } else {
    const parts = namePrefix.split(".");
    if (parts[0] === "variants" && parts[2] === "attributes") {
      const vi = Number(parts[1]);
      fieldError = (errors?.variants?.[vi]?.attributes as any)?.[attr.id]
        ?.message;
    }
  }

  const current = bag[attr.id] ?? "";

  const set = (val: string) =>
    setValue(
      namePrefix as keyof ProductFormData,
      { ...bag, [attr.id]: val } as any,
      { shouldValidate: true, shouldDirty: true },
    );

  const Label = () => (
    <p className="text-sm font-medium text-N700">
      {attr.name}
      {attr.isRequired ? (
        <span className="text-R400 ml-0.5">*</span>
      ) : (
        <span className="text-N300 font-normal ml-1 text-xs">(Optional)</span>
      )}
    </p>
  );
  const Error = () =>
    fieldError ? <p className="text-xs text-R400">{fieldError}</p> : null;

  switch (attr.inputType) {
    case "text":
      return (
        <div className="flex flex-col gap-1.5">
          <Label />
          <input
            type="text"
            value={current}
            onChange={(e) => set(e.target.value)}
            placeholder={`Enter ${attr.name.toLowerCase()}`}
            className={inputCls}
          />
          <Error />
        </div>
      );

    case "radio":
      return (
        <div className="flex flex-col gap-2">
          <Label />
          <div className="flex flex-wrap gap-2">
            {attr.options.map((opt) => {
              const active = current === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set(active ? "" : opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm border font-medium transition-all duration-150
                    ${
                      active
                        ? "bg-B300 text-white border-B300"
                        : "bg-white text-N600 border-N40 hover:border-B200 hover:text-B300"
                    }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <Error />
        </div>
      );

    case "checkbox":
      return (
        <div className="flex flex-col gap-2">
          <Label />
          <div className="flex flex-wrap gap-2">
            {attr.options.map((opt) => {
              const selected = current === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set(selected ? "" : opt.value)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm border transition-all duration-150
                    ${
                      selected
                        ? "bg-B50 text-B400 border-B200 font-semibold"
                        : "bg-white text-N500 border-N40 hover:border-B200"
                    }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors
                    ${selected ? "bg-B300 border-B300" : "border-N40"}`}
                  >
                    {selected && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path
                          d="M1 3L3 5L7 1"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>
          <Error />
        </div>
      );

    case "select":
    default:
      return (
        <div className="flex flex-col gap-1.5">
          <Label />
          <div className="relative">
            <select
              value={current}
              onChange={(e) => set(e.target.value)}
              className={`${inputCls} appearance-none pr-9`}
            >
              <option value="">Select {attr.name}</option>
              {attr.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-N400"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Error />
        </div>
      );
  }
};

export default AttributeRenderer;
