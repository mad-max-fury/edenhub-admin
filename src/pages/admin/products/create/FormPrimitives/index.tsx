import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { TextField } from "@/components";

// A label node with the required asterisk, fed to TextField's `label` prop.
const labelNode = (label: string, required?: boolean): ReactNode => (
  <>
    {label}
    {required && <span className="text-R400 ml-0.5">*</span>}
  </>
);

// ─── FormSection ──────────────────────────────────────────────────────────────
export const FormSection = ({
  icon,
  title,
  subtitle,
  action,
  children,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <section className="bg-white rounded-xl border border-N30 overflow-hidden">
    <div className="px-5 py-4 border-b border-N20 bg-N10/50 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="w-8 h-8 rounded-lg bg-BR50 text-white flex items-center justify-center shrink-0">
            {icon}
          </span>
        )}
        <div>
          <h3 className="text-sm font-bold text-N700 leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-N400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
    <div className="p-5 flex flex-col gap-5">{children}</div>
  </section>
);

// ─── FormField ────────────────────────────────────────────────────────────────
// Thin adapter over the design-system TextField for react-hook-form fields.
// Accepts a pre-built `registration` (so callers keep valueAsNumber etc.) and
// adds the required asterisk / hint / suffix conveniences.
interface FormFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  required?: boolean;
  error?: string;
  hint?: string;
  placeholder?: string;
  type?: string;
  min?: number;
  max?: number;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
}

export const FormField = ({
  label,
  registration,
  required,
  error,
  hint,
  placeholder,
  type = "text",
  min,
  max,
  prefix,
  suffix,
  disabled,
}: FormFieldProps) => {
  const adornment = suffix ?? prefix;
  return (
    <TextField
      {...registration}
      label={labelNode(label, required)}
      labelSubText={!error ? hint : undefined}
      type={type}
      min={min}
      max={max}
      disabled={disabled}
      placeholder={placeholder}
      error={!!error}
      errorText={error ?? ""}
      icon={
        adornment ? (
          <span className="text-sm text-N400 select-none">{adornment}</span>
        ) : undefined
      }
    />
  );
};

// ─── FormTextarea ─────────────────────────────────────────────────────────────
export const FormTextarea = ({
  label,
  registration,
  required,
  error,
  placeholder,
}: {
  label: string;
  registration: UseFormRegisterReturn;
  required?: boolean;
  error?: string;
  rows?: number;
  placeholder?: string;
}) => (
  <TextField
    {...registration}
    inputType="textarea"
    label={labelNode(label, required)}
    placeholder={placeholder}
    error={!!error}
    errorText={error ?? ""}
  />
);

// ─── YesNoToggle ──────────────────────────────────────────────────────────────
export const YesNoToggle = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-sm font-medium text-N700">{label}</span>
    <div className="flex items-center gap-1 bg-N10 border border-N30 rounded-lg p-1">
      {[
        { label: "No", val: false },
        { label: "Yes", val: true },
      ].map((opt) => {
        const active = value === opt.val;
        return (
          <button
            key={opt.label}
            type="button"
            onClick={() => onChange(opt.val)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
              active
                ? "bg-white text-N800 shadow-sm"
                : "text-N400 hover:text-N600"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  </div>
);
