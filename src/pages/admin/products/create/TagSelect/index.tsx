import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import type { ISelectItem } from "../types";

const FieldLabel = ({
  label,
  required,
}: {
  label?: string;
  required?: boolean;
}) =>
  label ? (
    <label className="text-sm font-medium text-N700">
      {label}
      {required && <span className="text-R400 ml-0.5">*</span>}
    </label>
  ) : null;

// Shared react-select styling tuned to the app's tokens.
const styles = (hasError?: boolean) => ({
  control: (base: any, state: any) => ({
    ...base,
    minHeight: 42,
    borderRadius: 8,
    borderColor: hasError
      ? "var(--color-R400)"
      : state.isFocused
        ? "var(--color-B200)"
        : "var(--color-N40)",
    boxShadow: state.isFocused
      ? `0 0 0 2px ${hasError ? "rgba(222,68,84,0.15)" : "rgba(38,132,255,0.15)"}`
      : "none",
    "&:hover": { borderColor: "var(--color-B200)" },
    fontSize: 14,
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "var(--color-B50)",
    borderRadius: 6,
  }),
  multiValueLabel: (base: any) => ({ ...base, color: "var(--color-B400)" }),
  menu: (base: any) => ({ ...base, zIndex: 40, fontSize: 14 }),
  placeholder: (base: any) => ({ ...base, color: "var(--color-N60)" }),
});

// ─── TagSelect (multi, creatable) ─────────────────────────────────────────────
interface TagSelectProps {
  label?: string;
  required?: boolean;
  value: ISelectItem[];
  onChange: (value: ISelectItem[]) => void;
  options: ISelectItem[];
  error?: string;
  placeholder?: string;
}

const TagSelect = ({
  label,
  required,
  value,
  onChange,
  options,
  error,
  placeholder = "Add or select tags…",
}: TagSelectProps) => (
  <div className="flex flex-col gap-1.5">
    <FieldLabel label={label} required={required} />
    <CreatableSelect
      isMulti
      value={value}
      onChange={(v) => onChange(v ? (v as ISelectItem[]).map((o) => o) : [])}
      options={options}
      placeholder={placeholder}
      styles={styles(!!error) as any}
      classNamePrefix="rs"
    />
    {error && <p className="text-xs text-R400">{error}</p>}
  </div>
);

// ─── SingleSelect ─────────────────────────────────────────────────────────────
interface SingleSelectProps {
  label?: string;
  required?: boolean;
  value: ISelectItem | null;
  onChange: (value: ISelectItem | null) => void;
  options: ISelectItem[];
  placeholder?: string;
  error?: string;
}

export const SingleSelect = ({
  label,
  required,
  value,
  onChange,
  options,
  placeholder = "Select…",
  error,
}: SingleSelectProps) => (
  <div className="flex flex-col gap-1.5">
    <FieldLabel label={label} required={required} />
    <Select
      value={value}
      onChange={(v) => onChange((v as ISelectItem) ?? null)}
      options={options}
      placeholder={placeholder}
      isClearable
      styles={styles(!!error) as any}
      classNamePrefix="rs"
    />
    {error && <p className="text-xs text-R400">{error}</p>}
  </div>
);

export default TagSelect;
