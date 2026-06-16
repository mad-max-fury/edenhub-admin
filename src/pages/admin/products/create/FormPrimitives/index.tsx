import type { ReactNode } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-N40 text-sm bg-white focus:outline-none focus:border-B200 focus:ring-2 focus:ring-B200/20 transition-all duration-150 placeholder:text-N60 disabled:bg-N20 disabled:cursor-not-allowed disabled:text-N70";

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
          <span className="w-8 h-8 rounded-lg bg-B50 text-B400 flex items-center justify-center shrink-0">
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

// ─── Label ────────────────────────────────────────────────────────────────────
const FieldLabel = ({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) => (
  <label className="text-sm font-medium text-N700">
    {label}
    {required && <span className="text-R400 ml-0.5">*</span>}
  </label>
);

// ─── FormField ────────────────────────────────────────────────────────────────
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
}: FormFieldProps) => (
  <div className="flex flex-col gap-1.5">
    <FieldLabel label={label} required={required} />
    <div className="relative">
      {prefix && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-N400 pointer-events-none select-none">
          {prefix}
        </span>
      )}
      <input
        {...registration}
        type={type}
        min={min}
        max={max}
        disabled={disabled}
        placeholder={placeholder}
        className={`${inputCls} ${prefix ? "pl-8" : ""} ${suffix ? "pr-16" : ""} ${
          error ? "border-R400 focus:border-R400 focus:ring-R400/20" : ""
        }`}
      />
      {suffix && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-N400 pointer-events-none select-none">
          {suffix}
        </span>
      )}
    </div>
    {error ? (
      <p className="text-xs text-R400">{error}</p>
    ) : hint ? (
      <p className="text-xs text-N400">{hint}</p>
    ) : null}
  </div>
);

// ─── FormTextarea ─────────────────────────────────────────────────────────────
export const FormTextarea = ({
  label,
  registration,
  required,
  error,
  rows = 4,
  placeholder,
}: {
  label: string;
  registration: UseFormRegisterReturn;
  required?: boolean;
  error?: string;
  rows?: number;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <FieldLabel label={label} required={required} />
    <textarea
      {...registration}
      rows={rows}
      placeholder={placeholder}
      className={`${inputCls} resize-y ${
        error ? "border-R400 focus:border-R400 focus:ring-R400/20" : ""
      }`}
    />
    {error && <p className="text-xs text-R400">{error}</p>}
  </div>
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
