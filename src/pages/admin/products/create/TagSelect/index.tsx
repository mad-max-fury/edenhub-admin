import { SMSelectDropDown } from "@/components";
import type { ISelectItem } from "../types";

// Label node carrying the required asterisk, fed to SMSelectDropDown's `label`.
const labelNode = (label?: string, required?: boolean) =>
  label ? (
    <>
      {label}
      {required && <span className="text-R400 ml-0.5">*</span>}
    </>
  ) : undefined;

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
  <SMSelectDropDown
    label={labelNode(label, required)}
    isMulti
    creatable
    searchable
    options={options}
    value={value}
    onChange={(v) => onChange((v as unknown as ISelectItem[]) ?? [])}
    placeholder={placeholder}
    isError={!!error}
    errorText={error ?? ""}
  />
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
  <SMSelectDropDown
    label={labelNode(label, required)}
    searchable
    isClearable
    options={options}
    value={value}
    onChange={(v) => onChange((v as unknown as ISelectItem) ?? null)}
    placeholder={placeholder}
    isError={!!error}
    errorText={error ?? ""}
  />
);

export default TagSelect;
