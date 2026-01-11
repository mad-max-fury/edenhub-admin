import React, { type Ref } from "react";
import type {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  Path,
  UseFormSetValue,
} from "react-hook-form";

export interface IFileUploadProps<IFormValues extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<IFormValues>;
  id?: string;
  label?: React.ReactNode | string;
  inputType?: "input";
  error?: boolean;
  errorText?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
  ref?: Ref<HTMLInputElement>;
  setValue?: UseFormSetValue<IFormValues>;
  required?: boolean;
  loader?: boolean;
  clearFieldValue?: () => void;
  formats?: string[];
  uploading?: boolean;
}
